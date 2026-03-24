import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateQuoteDto } from './dto/quote.dto';
import { CreatePdfDto } from './dto/pdf.dto';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import * as puppeteer from 'puppeteer';

@Injectable()
export class ApiService {
  private readonly logger = new Logger(ApiService.name);
  private transporter: nodemailer.Transporter;

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private configService: ConfigService,
  ) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('EMAIL_HOST'),
      port: this.configService.get('EMAIL_PORT'),
      secure: false, // true for 465, false for other ports
      // auth: {
      //   user: this.configService.get('EMAIL_USER'),
      //   pass: this.configService.get('EMAIL_PASS'),
      // },
    });
  }

  async findAll() {
    return await this.productRepository.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      this.logger.warn(`Product not found: ${id}`);
      throw new NotFoundException(`Producto #${id} no existe`);
    }
    this.logger.debug(`Product retrieved: ${id}`);
    return product;
  }

  async createQuote(createQuoteDto: CreateQuoteDto) {
    this.logger.log(
      `Creating quote for product ${createQuoteDto.productId} by ${createQuoteDto.firstName} ${createQuoteDto.lastName}`,
    );

    const product = await this.findOne(createQuoteDto.productId);
    const stats = this.calculateStats(
      product,
      createQuoteDto.tilesH,
      createQuoteDto.tilesV,
      createQuoteDto.unit as 'ft' | 'm',
    );

    const emailContent = this.generateEmailContent(
      createQuoteDto,
      product,
      stats,
    );

    try {
      await this.sendEmail(emailContent);
      this.logger.log(
        `Quote email sent successfully for ${createQuoteDto.firstName} ${createQuoteDto.lastName}`,
      );
      return { message: 'Quote request sent successfully' };
    } catch (error) {
      this.logger.error(
        `Failed to send quote email for ${createQuoteDto.firstName} ${createQuoteDto.lastName}`,
        error,
      );
      throw error;
    }
  }

  private calculateStats(
    product: Product,
    tilesH: number,
    tilesV: number,
    unit: 'ft' | 'm',
  ) {
    const totalTiles = tilesH * tilesV;
    const resH = tilesH * product.horizontal;
    const resV = tilesV * product.vertical;
    const pixelPitchM = product.pixelPitch / 1000; // Convert mm to m
    const widthM = tilesH * product.width * pixelPitchM;
    const heightM = tilesV * product.height * pixelPitchM;
    const depth = product.depth * pixelPitchM;
    const diagonal = Math.sqrt(widthM ** 2 + heightM ** 2);
    const aspect = `${tilesH * product.horizontal}:${tilesV * product.vertical}`;
    const surface = widthM * heightM;
    const powerMax = totalTiles * product.consumption;
    const powerAvg = powerMax * 0.5; // Assuming 50% average usage
    const weight = totalTiles * product.weight;
    const optViewDistance = diagonal / 6; // Rough estimate

    const dimUnit = unit === 'ft' ? 'ft' : 'm';
    const surfaceUnit = unit === 'ft' ? 'sq ft' : 'm²';

    // Convert to feet if needed
    const conversionFactor = unit === 'ft' ? 3.28084 : 1;
    const width = widthM * conversionFactor;
    const height = heightM * conversionFactor;
    const diagonalFt = diagonal * conversionFactor;
    const surfaceFt = surface * conversionFactor ** 2;
    const optViewDistanceFt = optViewDistance * conversionFactor;

    return {
      resH,
      resV,
      width,
      height,
      depth,
      diagonal: diagonalFt,
      aspect,
      surface: surfaceFt,
      powerMax,
      powerAvg,
      weight,
      optViewDistance: optViewDistanceFt,
      totalTiles,
      dimUnit,
      surfaceUnit,
    };
  }

  private generateEmailContent(
    dto: CreateQuoteDto,
    product: Product,
    stats: any,
  ) {
    return `
New Quote Request

Customer Information:
- Name: ${dto.firstName} ${dto.lastName}
- Email: ${dto.email}
- Phone: ${dto.phone}
- Company: ${dto.company}
- Project: ${dto.project}
- Assembly: ${dto.assembly}

Product Configuration:
- Product: ${product.name}
- Resolution: ${stats.resH} x ${stats.resV} px
- Dimensions: ${stats.width.toFixed(2)} x ${stats.height.toFixed(2)} x ${stats.depth.toFixed(2)} ${stats.dimUnit}
- Diagonal: ${stats.diagonal.toFixed(2)} ${stats.dimUnit}
- Aspect Ratio: ${stats.aspect}
- Surface: ${stats.surface.toFixed(2)} ${stats.surfaceUnit}
- Max Power: ${stats.powerMax.toFixed(2)} kW
- Avg Power: ${stats.powerAvg.toFixed(2)} kW
- Weight: ${stats.weight.toFixed(2)} kg
- Opt View Distance: >${stats.optViewDistance.toFixed(2)} ${stats.dimUnit}
- Brightness: ${product.brightness ?? 0} cd/m²
- Total Tiles: ${stats.totalTiles}
    `;
  }

  private async sendEmail(content: string) {
    const mailOptions = {
      from: this.configService.get('EMAIL_FROM'),
      to: this.configService.get('QUOTE_RECIPIENT'),
      subject: 'New Quote Request from LED Configurator',
      text: content,
    };

    this.logger.debug(`Sending email to ${mailOptions.to}`);
    await this.transporter.sendMail(mailOptions);
    this.logger.debug('Email sent successfully');
  }

  async createPdf(createPdfDto: CreatePdfDto) {
    this.logger.log(`Generating PDF for product ${createPdfDto.productId}`);

    const product = await this.findOne(createPdfDto.productId);
    const stats = this.calculateStats(
      product,
      createPdfDto.tilesH,
      createPdfDto.tilesV,
      createPdfDto.unit as 'ft' | 'm',
    );

    const htmlContent = this.generatePdfHtml(product, stats);

    try {
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });

      const page = await browser.newPage();
      await page.setContent(htmlContent);
      await page.emulateMediaType('screen');

      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20px',
          right: '20px',
          bottom: '20px',
          left: '20px',
        },
      });

      await browser.close();

      this.logger.log(
        `PDF generated successfully for product ${createPdfDto.productId}`,
      );
      return pdfBuffer;
    } catch (error) {
      this.logger.error(
        `Failed to generate PDF for product ${createPdfDto.productId}`,
        error,
      );
      throw error;
    }
  }

  private generatePdfHtml(product: Product, stats: any) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>LED Screen Configuration - ${product.name}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            color: #333;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #007bff;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .header h1 {
            color: #007bff;
            margin: 0;
          }
          .header p {
            color: #666;
            margin: 5px 0;
          }
          .section {
            margin-bottom: 30px;
          }
          .section h2 {
            color: #007bff;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
          }
          .product-info {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
          }
          .specs-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
          }
          .spec-item {
            background: white;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 3px;
          }
          .spec-label {
            font-weight: bold;
            color: #555;
            font-size: 0.9em;
          }
          .spec-value {
            font-size: 1.1em;
            color: #333;
            margin-top: 2px;
          }
          .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 0.9em;
            color: #666;
            border-top: 1px solid #ddd;
            padding-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>LED Screen Configuration</h1>
          <p>Generated on ${new Date().toLocaleDateString()}</p>
        </div>

        <div class="section">
          <h2>Product Information</h2>
          <div class="product-info">
            <h3>${product.name}</h3>
            <p><strong>Location:</strong> ${Array.isArray(product.location) ? product.location.join(', ') : product.location}</p>
            <p><strong>Application:</strong> ${Array.isArray(product.application) ? product.application.join(', ') : product.application}</p>
          </div>
        </div>

        <div class="section">
          <h2>Technical Specifications</h2>
          <div class="specs-grid">
            <div class="spec-item">
              <div class="spec-label">Resolution</div>
              <div class="spec-value">${stats.resH} x ${stats.resV} px</div>
            </div>
            <div class="spec-item">
              <div class="spec-label">Pixel Pitch</div>
              <div class="spec-value">${product.pixelPitch} mm</div>
            </div>
            <div class="spec-item">
              <div class="spec-label">Dimensions</div>
              <div class="spec-value">${stats.width.toFixed(2)} x ${stats.height.toFixed(2)} x ${stats.depth.toFixed(2)} ${stats.dimUnit}</div>
            </div>
            <div class="spec-item">
              <div class="spec-label">Diagonal</div>
              <div class="spec-value">${stats.diagonal.toFixed(2)} ${stats.dimUnit}</div>
            </div>
            <div class="spec-item">
              <div class="spec-label">Aspect Ratio</div>
              <div class="spec-value">${stats.aspect}</div>
            </div>
            <div class="spec-item">
              <div class="spec-label">Surface Area</div>
              <div class="spec-value">${stats.surface.toFixed(2)} ${stats.surfaceUnit}</div>
            </div>
            <div class="spec-item">
              <div class="spec-label">Max Power Consumption</div>
              <div class="spec-value">${stats.powerMax.toFixed(2)} kW</div>
            </div>
            <div class="spec-item">
              <div class="spec-label">Avg Power Consumption</div>
              <div class="spec-value">${stats.powerAvg.toFixed(2)} kW</div>
            </div>
            <div class="spec-item">
              <div class="spec-label">Weight</div>
              <div class="spec-value">${stats.weight.toFixed(2)} kg</div>
            </div>
            <div class="spec-item">
              <div class="spec-label">Optimal View Distance</div>
              <div class="spec-value">>${stats.optViewDistance.toFixed(2)} ${stats.dimUnit}</div>
            </div>
            <div class="spec-item">
              <div class="spec-label">Brightness</div>
              <div class="spec-value">${product.brightness ?? 0} cd/m²</div>
            </div>
            <div class="spec-item">
              <div class="spec-label">Total Tiles</div>
              <div class="spec-value">${stats.totalTiles}</div>
            </div>
          </div>
        </div>

        <div class="footer">
          <p>This configuration report was generated by Alfalite LED Configurator</p>
          <p>For more information, contact our sales team</p>
        </div>
      </body>
      </html>
    `;
  }
}
