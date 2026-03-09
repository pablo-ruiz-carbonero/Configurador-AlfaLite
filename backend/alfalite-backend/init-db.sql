CREATE USER alfalite_public WITH PASSWORD 'public_password';

CREATE ROLE app_owner NOLOGIN;
CREATE ROLE app_public_role NOLOGIN;
CREATE ROLE app_admin_role NOLOGIN;

GRANT app_owner TO alfalite_public;
GRANT app_admin_role TO alfalite_admin;

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    location TEXT[] NOT NULL,
    application TEXT[] NOT NULL,
    horizontal INTEGER NOT NULL,
    vertical INTEGER NOT NULL,
    pixel_pitch DOUBLE PRECISION NOT NULL,
    width DOUBLE PRECISION NOT NULL,
    height DOUBLE PRECISION NOT NULL,
    depth DOUBLE PRECISION NOT NULL,
    consumption DOUBLE PRECISION NOT NULL,
    weight DOUBLE PRECISION NOT NULL,
    brightness INTEGER NOT NULL,
    refresh_rate DOUBLE PRECISION,
    contrast TEXT,
    vision_angle TEXT,
    redundancy TEXT,
    curved_version TEXT,
    optical_multilayer_injection TEXT,
    image TEXT
);

CREATE TABLE processors (
    id SERIAL PRIMARY KEY,
    brand TEXT NOT NULL,
    series TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    applications TEXT[] NOT NULL,
    connectors_input JSONB, 
    connectors_output JSONB, 
    max_width INTEGER,
    max_height INTEGER,
    max_pixels INTEGER,
    max_input_cards INTEGER,
    max_output_cards INTEGER,
    max_pixels_rj45 INTEGER,
    max_pixels_opt INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE connectors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL, 
    max_resolution VARCHAR(50), 
    max_refresh_rate INTEGER, 
    bandwidth_gbps DECIMAL(5,2), 
    description TEXT,
    image_path VARCHAR(255), 
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE receiving_cards (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    card_type VARCHAR(20) NOT NULL CHECK (card_type IN ('input', 'output')), 
    brand VARCHAR(50) NOT NULL, 
    series VARCHAR(50), 
    description TEXT,
    connectors JSONB NOT NULL, 
    slots_required INTEGER NOT NULL DEFAULT 1, 
    max_resolution VARCHAR(50), 
    max_refresh_rate INTEGER, 
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE led_receiving_cards (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    brand VARCHAR(50) NOT NULL, 
    series VARCHAR(50), 
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE converters (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    brand VARCHAR(50) NOT NULL,
    model VARCHAR(100) NOT NULL,
    description TEXT,
    compatible_processors JSONB, 
    input_type VARCHAR(50) NOT NULL, 
    output_type VARCHAR(50) NOT NULL, 
    max_ports INTEGER,
    max_bandwidth_gbps DECIMAL(10,2),
    power_consumption_watts DECIMAL(5,2),
    dimensions_mm JSONB, 
    weight_kg DECIMAL(5,2),
    price_usd DECIMAL(10,2),
    image_path VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Permisos (Omitidos para no alargar, pero mantén los tuyos del archivo original aquí)
-- ... [TUS ALTER TABLE Y GRANT VAN AQUÍ] ...

-- Set ownership and permissions
ALTER TABLE products OWNER TO app_owner;
ALTER TABLE processors OWNER TO app_owner;
ALTER TABLE connectors OWNER TO app_owner;
ALTER TABLE receiving_cards OWNER TO app_owner;
ALTER TABLE led_receiving_cards OWNER TO app_owner;
ALTER TABLE users OWNER TO app_owner;
ALTER TABLE converters OWNER TO app_owner;

ALTER SEQUENCE products_id_seq OWNER TO app_owner;
ALTER SEQUENCE processors_id_seq OWNER TO app_owner;
ALTER SEQUENCE connectors_id_seq OWNER TO app_owner;
ALTER SEQUENCE receiving_cards_id_seq OWNER TO app_owner;
ALTER SEQUENCE led_receiving_cards_id_seq OWNER TO app_owner;
ALTER SEQUENCE users_id_seq OWNER TO app_owner;
ALTER SEQUENCE converters_id_seq OWNER TO app_owner;

-- Grant permissions for new tables
GRANT SELECT ON products TO app_public_role;
GRANT SELECT ON processors TO app_public_role;
GRANT SELECT ON connectors TO app_public_role;
GRANT SELECT ON receiving_cards TO app_public_role;
GRANT SELECT ON led_receiving_cards TO app_public_role;
GRANT SELECT ON users TO app_public_role;
GRANT SELECT ON converters TO app_public_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON products TO app_admin_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON processors TO app_admin_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON connectors TO app_admin_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON receiving_cards TO app_admin_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON led_receiving_cards TO app_admin_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON users TO app_admin_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON converters TO app_admin_role;

GRANT USAGE, SELECT ON SEQUENCE products_id_seq TO app_admin_role;
GRANT USAGE, SELECT ON SEQUENCE processors_id_seq TO app_admin_role;
GRANT USAGE, SELECT ON SEQUENCE connectors_id_seq TO app_admin_role;
GRANT USAGE, SELECT ON SEQUENCE receiving_cards_id_seq TO app_admin_role;
GRANT USAGE, SELECT ON SEQUENCE led_receiving_cards_id_seq TO app_admin_role;
GRANT USAGE, SELECT ON SEQUENCE users_id_seq TO app_admin_role;
GRANT USAGE, SELECT ON SEQUENCE converters_id_seq TO app_admin_role;

-- Inserts Corregidos
INSERT INTO products (id, name, location, application, horizontal, vertical, pixel_pitch, width, height, depth, consumption, weight, brightness, image, refresh_rate, contrast, vision_angle, redundancy, curved_version, optical_multilayer_injection) VALUES
   (1, 'MICROFIX 4', ARRAY['outdoor'], ARRAY['Corporate','Retail'], 108, 108, 4.62, 500, 500, 100, 0.09, 9.5, 7000, '/images/1755603808484_microfix.webp', 3840, '10000:1', '160°/140°', 'No', 'No', 'No'),
   (2, 'Litepix 1i', ARRAY['indoor'], ARRAY['Rental'], 256, 256, 1.95, 500, 500, 100, 0.09, 8.9, 1900, '/images/1755603856883_litepix.webp', 7680, '10000:1', '160°/140°', 'No', '0°/15°', 'Yes'),
   (3, 'Litepix 1i Pro', ARRAY['indoor'], ARRAY['Rental'], 320, 320, 1.5, 500, 500, 100, 0.09, 8.9, 1900, '/images/1755603749398_litepix.webp', 7680, '10000:1', '160°/140°', 'No', '0°/15°', 'Yes'),
   (4, 'Litepix 2+', ARRAY['outdoor','indoor'], ARRAY['Rental'], 168, 168, 2.9, 500, 500, 100, 0.09, 8.9, 5000, '/images/1755850565981_litepix.webp', 3840, '10000:1', '160°/140°', 'No', '-15°/15°', 'Yes'),
   (5, 'Litepix 2i', ARRAY['indoor'], ARRAY['Rental'], 168, 168, 2.97, 500, 500, 100, 0.09, 8.9, 1500, '/images/1755850612285_litepix.webp', 4440, '10000:1', '160°/140°', 'No', '-15°/15°', 'Yes'),
   (6, 'Litepix 2i Pro', ARRAY['indoor'], ARRAY['Rental'], 192, 192, 2.6, 500, 500, 100, 0.09, 8.9, 1900, '/images/1755850629011_litepix.webp', 7680, '10000:1', '160°/140°', 'No', '0°/15°', 'Yes'),
   (7, 'Litepix 3+', ARRAY['outdoor'], ARRAY['Rental'], 128, 128, 3.91, 500, 500, 100, 0.09, 8.9, 5000, '/images/1755850638814_litepix.webp', 3840, '10000:1', '160°/140°', 'No', '-15°/15°', 'Yes'),
   (8, 'Litepix 3i', ARRAY['indoor'], ARRAY['Rental'], 128, 128, 3.91, 500, 500, 100, 0.09, 8.9, 1300, '/images/1755850649880_litepix.webp', 4440, '10000:1', '160°/140°', 'No', '-15°/15°', 'Yes'),
   (9, 'Litepix 4+', ARRAY['outdoor','indoor'], ARRAY['Rental'], 104, 104, 4.8, 500, 500, 100, 0.09, 8.9, 5500, '/images/1755850660071_litepix.webp', 3840, '10000:1', '160°/140°', 'No', '-15°/15°', 'Yes'),
   (10, 'Litepix 5+', ARRAY['outdoor'], ARRAY['Rental'], 84, 84, 5.9, 500, 500, 100, 0.09, 8.9, 5000, '/images/1755850671897_litepix.webp', 3840, '10000:1', '160°/140°', 'No', '-15°/15°', 'Yes'),
   (19, 'Modularpix 1.5/1000', ARRAY['indoor'], ARRAY['Corporate','Retail','Entertainment'], 640, 160, 1.5, 1000, 250, 100, 0.065, 6.3, 1000, '/images/1755850366381_modularpix1000.webp', 3840, '10000:1', '160°/140°', 'No', 'No', 'Yes'),
   (20, 'Modularpix 1.5/500', ARRAY['indoor'], ARRAY['Corporate','Retail','Entertainment'], 320, 160, 1.5, 500, 250, 100, 0.035, 4, 1000, '/images/1755851187168_modularpix500.webp', 3840, '10000:1', '160°/140°', 'No', 'No', 'Yes'),
   (21, 'Modularpix 1.5/750', ARRAY['indoor'], ARRAY['Corporate','Retail','Entertainment'], 480, 160, 1.5, 750, 250, 100, 0.035, 5.1, 1000, '/images/1755851445519_modularpix750.webp', 3840, '10000:1', '160°/140°', 'No', 'No', 'Yes'),
   (22, 'Modularpix 1.9/1000', ARRAY['indoor'], ARRAY['Corporate','Retail','Entertainment'], 512, 128, 1.95, 1000, 250, 100, 0.065, 6.3, 1000, '/images/1755851872658_modularpix1000.webp', 3840, '10000:1', '160°/140°', 'No', 'No', 'Yes'),
   (23, 'Modularpix 1.9/500', ARRAY['indoor'], ARRAY['Corporate','Retail','Entertainment'], 256, 128, 1.95, 500, 250, 100, 0.0349, 4, 1000, '/images/1755852338029_modularpix500.webp', 3840, '10000:1', '160°/140°', 'No', 'No', 'Yes'),
   (24, 'Modularpix 1.9/750', ARRAY['indoor'], ARRAY['Corporate','Retail','Entertainment'], 384, 128, 1.95, 750, 250, 100, 0.05, 5.1, 1000, '/images/1755855796795_modularpix750.webp', 3840, '10000:1', '160°/140°', 'No', 'No', 'Yes'),
   (25, 'Modularpix 2.6/1000', ARRAY['indoor'], ARRAY['Corporate','Retail','Entertainment'], 384, 96, 2.6, 1000, 250, 100, 0.065, 6.3, 1000, '/images/1755859081430_modularpix1000.webp', 3840, '10000:1', '160°/140°', 'No', 'No', 'Yes'),
   (26, 'Modularpix 2.6/500', ARRAY['indoor'], ARRAY['Corporate','Retail','Entertainment'], 192, 96, 2.6, 500, 250, 100, 0.0349, 4, 1000, '/images/1755860072568_modularpix500.webp', 3840, '10000:1', '160°/140°', 'No', 'No', 'Yes'),
   (27, 'Modularpix 2.6/750', ARRAY['indoor'], ARRAY['Corporate','Retail','Entertainment'], 288, 96, 2.6, 750, 250, 100, 0.05, 5.1, 1000, '/images/1755860184066_modularpix750.webp', 3840, '10000:1', '160°/140°', 'No', 'No', 'Yes'),
   (28, 'Modularpix 3.9/1000', ARRAY['indoor'], ARRAY['Corporate','Retail','Entertainment'], 256, 64, 3.91, 1000, 250, 100, 0.065, 6.3, 1000, '/images/1755861029146_modularpix1000.webp', 3840, '10000:1', '160°/140°', 'No', 'No', 'Yes'),
   (29, 'Modularpix 3.9/500', ARRAY['indoor'], ARRAY['Corporate','Retail','Entertainment'], 128, 64, 3.91, 500, 250, 100, 0.0349, 4, 1000, '/images/1755861130485_modularpix500.webp', 3840, '10000:1', '160°/140°', 'No', 'No', 'Yes'),
   (30, 'Modularpix 3.9/750', ARRAY['indoor'], ARRAY['Corporate','Retail','Entertainment'], 192, 64, 3.91, 750, 250, 100, 0.05, 5.1, 1000, '/images/1755861226357_modularpix750.webp', 3840, '10000:1', '160°/140°', 'No', 'No', 'Yes'),
   (31, 'Modularpix Pro 1.5', ARRAY['indoor'], ARRAY['Broadcast','Film & Series','Advertisement','Entertainment','Transport'], 320, 320, 1.5, 500, 500, 100, 0.09, 8.9, 1500, '/images/1755861400406_modularpixpro.webp', 7680, '10000:1', '160°/140°', 'No', '-15°/15°', 'Yes'),
   (32, 'Modularpix Pro 1.9', ARRAY['indoor'], ARRAY['Broadcast','Film & Series','Advertisement','Entertainment','Transport'], 256, 256, 1.95, 500, 500, 100, 0.09, 8.9, 1500, '/images/1755861516478_modularpixpro.webp', 7680, '10000:1', '160°/140°', 'No', '-15°/15°', 'Yes'),
   (33, 'Modularpix Pro 2.6', ARRAY['indoor'], ARRAY['Broadcast','Film & Series','Advertisement','Entertainment','Transport'], 192, 192, 2.6, 500, 500, 100, 0.09, 8.9, 1500, '/images/1755861631143_modularpixpro.webp', 7680, '10000:1', '160°/140°', 'No', '-15°/15°', 'Yes'),
   (34, 'Modularpix Pro 2.9', ARRAY['indoor'], ARRAY['Broadcast','Film & Series','Advertisement','Entertainment','Transport'], 168, 168, 2.97, 500, 500, 100, 0.09, 8.9, 1500, '/images/1755861753305_modularpixpro.webp', 4440, '10000:1', '160°/140°', 'No', '-15°/15°', 'Yes'),
   (35, 'Modularpix Pro 3', ARRAY['indoor'], ARRAY['Broadcast','Film & Series','Advertisement','Entertainment','Transport'], 128, 128, 3.91, 500, 500, 100, 0.09, 8.9, 1300, '/images/1755861878657_modularpixpro.webp', 4440, '10000:1', '160°/140°', 'No', '-15°/15°', 'Yes'),
   (36, 'Modularpix Pro HB 2', ARRAY['indoor','outdoor'], ARRAY['Broadcast','Film & Series','Advertisement','Entertainment','Transport'], 168, 168, 2.97, 500, 500, 100, 0.09, 8.9, 5000, '/images/1755862108820_modularpixpro.webp', 3840, '10000:1', '160°/140°', 'No', '-15°/15°', 'No'),
   (37, 'Modularpix Pro HB 3', ARRAY['indoor','outdoor'], ARRAY['Broadcast','Film & Series','Advertisement','Entertainment','Transport'], 128, 128, 3.91, 500, 500, 100, 0.09, 8.9, 5000, '/images/1755862233543_modularpixpro.webp', 3840, '10000:1', '160°/140°', 'No', '-15°/15°', 'No'),
   (38, 'Modularpix Pro HB 4', ARRAY['indoor','outdoor'], ARRAY['Broadcast','Film & Series','Advertisement','Entertainment','Transport'], 104, 104, 4.8, 500, 500, 100, 0.09, 8.9, 5500, '/images/1755862871400_modularpixpro.webp', 3840, '10000:1', '160°/140°', 'No', '-15°/15°', 'No'),
   (39, 'Modularpix Pro HB 5', ARRAY['indoor','outdoor'], ARRAY['Broadcast','Film & Series','Advertisement','Entertainment','Transport'], 84, 84, 5.9, 500, 500, 100, 0.09, 8.9, 5500, '/images/1755862997066_modularpixpro.webp', 3840, '10000:1', '160°/140°', 'No', '-15°/15°', 'No'),
   (40, 'Neopix 1i MATIX Alfa', ARRAY['indoor'], ARRAY['Rental','Broadcast','Film & Series','Advertisement','Entertainment','Transport'], 256, 256, 1.95, 500, 500, 100, 0.09, 8.5, 1900, '/images/1755863602537_neopix.webp', 7680, '10000:1', '175°', 'Yes', '-1.5°/7.5°', 'Yes'),
   (41, 'Neopix 1i Pro MATIX', ARRAY['indoor'], ARRAY['Rental','Broadcast','Film & Series','Advertisement','Entertainment','Transport'], 320, 320, 1.5, 500, 500, 100, 0.09, 8.5, 1900, '/images/1755863722590_neopix.webp', 7680, '10000:1', '175°', 'Yes', '-1.5°/7.5°', 'Yes'),
   (42, 'Neopix 2i Pro', ARRAY['indoor'], ARRAY['Rental','Broadcast','Film & Series','Advertisement','Entertainment','Transport'], 192, 192, 2.6, 500, 500, 100, 0.09, 8.5, 1900, '/images/1755863846755_neopix.webp', 7680, '10000:1', '175°', 'Yes', '-1.5°/7.5°', 'Yes'),
   (43, 'Neopix 3+ HB', ARRAY['outdoor','indoor'], ARRAY['Rental','Broadcast','Film & Series','Advertisement','Entertainment','Transport'], 128, 128, 3.9, 500, 500, 100, 0.09, 8.5, 5000, '/images/1755863975457_neopix.webp', 3840, '10000:1', '160°/140°', 'Yes', '-5°/7.5°', 'Yes'),
   (44, 'ODSX 10', ARRAY['outdoor','indoor'], ARRAY['Advertisement','Transport','Corporate','Retail','Sport'], 96, 96, 10, 960, 960, 170, 0.7, 30, 6500, '/images/1755864532486_odsx960.webp', 1920, '10000:1', '160°/140°', 'No', 'No', 'No'),
   (45, 'ODSX 16', ARRAY['outdoor','indoor'], ARRAY['Advertisement','Transport','Corporate','Retail','Sport'], 60, 60, 16, 960, 960, 170, 0.7, 30, 6500, '/images/1755864928749_odsx960.webp', 1920, '10000:1', '160°/140°', 'No', 'No', 'No'),
   (46, 'ODSX 2', ARRAY['outdoor','indoor'], ARRAY['Advertisement','Transport','Corporate','Retail','Sport'], 168, 336, 2.91, 500, 1000, 170, 0.7, 16, 5000, '/images/1755865068088_odsx500.webp', 3840, '10000:1', '160°/140°', 'No', 'No', 'No'),
   (47, 'ODSX 3', ARRAY['outdoor','indoor'], ARRAY['Advertisement','Transport','Corporate','Retail','Sport'], 128, 256, 3.91, 500, 1000, 170, 0.7, 16, 5000, '/images/1755865337785_odsx500x1000.webp', 3840, '10000:1', '160°/140°', 'No', 'No', 'No'),
   (48, 'ODSX 3/500', ARRAY['outdoor','indoor'], ARRAY['Advertisement','Transport','Corporate','Retail','Sport'], 128, 128, 3.91, 500, 500, 170, 0.04, 8, 5000, '/images/1755865473470_odsx500.webp', 3840, '10000:1', '160°/140°', 'No', 'No', 'No'),
   (49, 'ODSX 4', ARRAY['outdoor','indoor'], ARRAY['Advertisement','Transport','Corporate','Retail','Sport'], 104, 208, 4.8, 500, 1000, 170, 0.7, 16, 5000, '/images/1755865616187_odsx500x1000.webp', 3840, '10000:1', '160°/140°', 'No', 'No', 'No'),
   (50, 'ODSX 4/500', ARRAY['outdoor','indoor'], ARRAY['Advertisement','Transport','Corporate','Retail','Sport'], 104, 104, 4.8, 500, 500, 170, 0.04, 8, 5000, '/images/1755865927322_odsx500.webp', 3840, '10000:1', '160°/140°', 'No', 'No', 'No'),
   (51, 'ODSX 5', ARRAY['outdoor','indoor'], ARRAY['Advertisement','Transport','Corporate','Retail','Sport'], 84, 168, 5.9, 500, 1000, 170, 0.7, 16, 5500, '/images/1755866028647_odsx500x1000.webp', 3840, '10000:1', '160°/140°', 'No', 'No', 'No'),
   (52, 'ODSX 5/500', ARRAY['outdoor','indoor'], ARRAY['Advertisement','Transport','Corporate','Retail','Sport'], 84, 84, 5.9, 500, 500, 170, 0.04, 8, 5500, '/images/1755866165942_odsx500.webp', 3840, '10000:1', '160°/140°', 'No', 'No', 'No'),
   (53, 'ODSX 6', ARRAY['outdoor','indoor'], ARRAY['Advertisement','Transport','Corporate','Retail','Sport'], 144, 144, 6.6, 960, 960, 170, 0.7, 30, 6500, '/images/1755866476431_odsx960.webp', 1920, '10000:1', '160°/140°', 'No', 'No', 'No'),
   (54, 'ODSX 8', ARRAY['outdoor','indoor'], ARRAY['Advertisement','Transport','Corporate','Retail','Sport'], 120, 120, 8, 960, 960, 170, 0.7, 30, 6500, '/images/1755866617305_odsx960.webp', 2400, '10000:1', '160°/140°', 'No', 'No', 'No'),
   (55, 'UHD Finepix 0.6 MATIX', ARRAY['indoor'], ARRAY['Broadcast','Film & Series','Advertisement','Entertainment','Corporate','Retail'], 960, 540, 0.6, 600, 340, 30, 0.05, 5, 900, '/images/1755866854250_uhdfinepix.webp', 7680, '10000:1', '175°', 'Yes', 'No', 'Yes'),
   (56, 'UHD Finepix 0.9 MATIX', ARRAY['indoor'], ARRAY['Broadcast','Film & Series','Advertisement','Entertainment','Corporate','Retail'], 640, 360, 0.9, 600, 340, 30, 0.05, 5, 1500, '/images/1755867007664_uhdfinepix.webp', 7680, '10000:1', '175°', 'Yes', 'No', 'Yes'),
   (57, 'UHD Finepix 1.2 MATIX', ARRAY['indoor'], ARRAY['Broadcast','Film & Series','Advertisement','Entertainment','Corporate','Retail'], 480, 270, 1.2, 600, 340, 30, 0.05, 5, 1500, '/images/1755867164239_uhdfinepix.webp', 7680, '10000:1', '175°', 'Yes', 'No', 'Yes'),
   (58, 'UHD Finepix 1.5 MATIX', ARRAY['indoor'], ARRAY['Broadcast','Film & Series','Advertisement','Entertainment','Corporate','Retail'], 384, 216, 1.5, 600, 340, 30, 0.05, 5, 1500, '/images/1755867290780_uhdfinepix.webp', 7680, '10000:1', '175°', 'Yes', 'No', 'Yes'),
   (59, 'UHD Finepix 1.8 MATIX', ARRAY['indoor'], ARRAY['Broadcast','Film & Series','Advertisement','Entertainment','Corporate','Retail'], 320, 180, 1.8, 600, 340, 30, 0.05, 5, 1500, '/images/1755867415792_uhdfinepix.webp', 7680, '10000:1', '175°', 'Yes', 'No', 'Yes');

SELECT setval('products_id_seq', (SELECT MAX(id) FROM products));

INSERT INTO connectors (name, display_name, category, max_resolution, max_refresh_rate, bandwidth_gbps, description, image_path) VALUES
('HDMI 1.3', 'HDMI 1.3', 'HDMI', '2K', 60, 10.2, 'HDMI 1.3 standard with 10.2 Gbps bandwidth', 'assets/images/connectors/HDMI_1-3.png'),
('OPT_1G', 'OPT 1G', 'Optical', '4K', 60, 1.0, '1G Optical connection', 'assets/images/connectors/OPT.png')
ON CONFLICT (name) DO NOTHING;

-- (Puedes añadir el resto de tus inserts asegurándote de no dejar comas finales antes del ON CONFLICT)