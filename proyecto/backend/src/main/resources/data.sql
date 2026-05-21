-- ==============================================================================
-- SCRIPT DE INICIALIZACIÓN AUTOMÁTICA PARA H2 DATABASE (PYMEWEB)
-- Ubicación recomendada: /proyecto/backend/src/main/resources/data.sql
-- ==============================================================================

-- Limpieza preventiva para evitar duplicados en reinicios sin borrar archivo de BD
DELETE FROM plantillas_base;

-- 1. PLANTILLA DE MASCOTAS (Requiere Inventario Dinámico)
INSERT INTO plantillas_base (tipo_rubro, requiere_inventario, contenido_json) 
VALUES (
    'mascotas', 
    true, 
    '[{"tipoSeccion":"BARRA_MENU","contenido":{"logotipo":"","enlaces":[{"texto":"Inicio","url":"#"},{"texto":"Productos","url":"#productos"},{"texto":"Contacto","url":"#contacto"}]}},{"tipoSeccion":"LOGO","contenido":{"nombreEmpresa":"{{NOMBRE_NEGOCIO}}","urlImagen":""}},{"tipoSeccion":"CABECERA","contenido":{"titulo":"Todo para tus mascotas en {{NOMBRE_NEGOCIO}}","subtitulo":"Los mejores productos y alimentos para consentir a tus regalones.","imagenFondo":""}},{"tipoSeccion":"PRODUCTOS","contenido":{"titulo":"Nuestro Catálogo","descripcion":"Explora todos los productos que tenemos disponibles en tienda.","productos":[]}},{"tipoSeccion":"CONTACTO","contenido":{"titulo":"Visítanos","descripcion":"Atención personalizada para ti y tu mascota.","telefono":"+56 9 1122 3344","email":"hola@mascotas.cl","direccion":"Centro de Melipilla"}}]'
);

-- 2. PLANTILLA DE ABOGADOS (Servicios Estáticos - No requiere Inventario)
INSERT INTO plantillas_base (tipo_rubro, requiere_inventario, contenido_json) 
VALUES (
    'abogados', 
    false, 
    '[{"tipoSeccion":"BARRA_MENU","contenido":{"logotipo":"","enlaces":[{"texto":"Inicio","url":"#"},{"texto":"Servicios","url":"#servicios"},{"texto":"Contacto","url":"#contacto"}]}},{"tipoSeccion":"LOGO","contenido":{"nombreEmpresa":"{{NOMBRE_NEGOCIO}}","urlImagen":""}},{"tipoSeccion":"CABECERA","contenido":{"titulo":"Estudio Jurídico {{NOMBRE_NEGOCIO}}","subtitulo":"Defensa legal integral y asesoría profesional para proteger tus derechos.","imagenFondo":""}},{"tipoSeccion":"SERVICIOS","contenido":{"titulo":"Nuestros Servicios Legales","descripcion":"Soluciones jurídicas estratégicas y de alta confianza.","listaServicios":[{"nombre":"Derecho Civil","descripcion":"Contratos, herencias y asesoría patrimonial."},{"nombre":"Derecho Laboral","descripcion":"Defensa del trabajador y asesoría a empleadores."}]}},{"tipoSeccion":"CONTACTO","contenido":{"titulo":"Agenda tu Asesoría","descripcion":"Escríbenos o visítanos en nuestra oficina principal.","telefono":"+56 9 9988 7766","email":"contacto@abogados.cl","direccion":"Melipilla Centro"}}]'
);

-- 3. PLANTILLA DE RESTAURANTE (Gastronomía - Requiere Inventario Dinámico para la Carta)
INSERT INTO plantillas_base (tipo_rubro, requiere_inventario, contenido_json) 
VALUES (
    'restaurante', 
    true, 
    '[{"tipoSeccion":"BARRA_MENU","contenido":{"logotipo":"","enlaces":[{"texto":"Inicio","url":"#"},{"texto":"Menú","url":"#productos"},{"texto":"Contacto","url":"#contacto"}]}},{"tipoSeccion":"LOGO","contenido":{"nombreEmpresa":"{{NOMBRE_NEGOCIO}}","urlImagen":""}},{"tipoSeccion":"CABECERA","contenido":{"titulo":"Bienvenidos a {{NOMBRE_NEGOCIO}}","subtitulo":"Sabor local, frescura y una experiencia gastronómica inolvidable.","imagenFondo":""}},{"tipoSeccion":"PRODUCTOS","contenido":{"titulo":"Nuestra Carta","descripcion":"Platos preparados al momento con ingredientes seleccionados.","productos":[]}},{"tipoSeccion":"CONTACTO","contenido":{"titulo":"Reserva tu Mesa","descripcion":"Disfruta de la mejor atención culinaria de la zona.","telefono":"+56 9 5544 3322","email":"reservas@restaurante.cl","direccion":"Plaza de Armas de Melipilla"}}]'
);
