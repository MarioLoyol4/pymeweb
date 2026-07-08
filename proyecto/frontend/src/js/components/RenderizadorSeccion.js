import { Logo } from '../../components/secciones/Logo';
import { Cabecera } from '../../components/secciones/Cabecera';
import { Acerca_nosotros } from '../../components/secciones/Acerca_nosotros';
import { BarraMenu } from '../../components/secciones/Barra_menu';
import { Servicios } from '../../components/secciones/Servicios';
import { Contacto } from '../../components/secciones/Contacto';
import { Redes_sociales } from '../../components/secciones/Redes_sociales';
import { Productos } from '../../components/secciones/Productos';
import SharedFooter from '../../components/SharedFooter';

export const resolverRenderizadoSeccion = (tipoSeccion, contenidoJson, logoContenidoJson = null) => {
    const contenido = JSON.parse(contenidoJson);
    const logoContenido = logoContenidoJson ? JSON.parse(logoContenidoJson) : null;

    switch (tipoSeccion) {
        case 'LOGO':
            return { Componente: Logo, props: { contenido } };
        case 'BARRA_MENU':
            return { Componente: BarraMenu, props: { contenido, logoContenido } };
        case 'CABECERA':
            return { Componente: Cabecera, props: { contenido } };
        case 'ACERCA_DE_NOSOTROS':
            return { Componente: Acerca_nosotros, props: { contenido } };
        case 'SERVICIOS':
            return { Componente: Servicios, props: { contenido } };
        case 'PRODUCTOS':
            return { Componente: Productos, props: { contenido } };
        case 'REDES_SOCIALES':
            return { Componente: Redes_sociales, props: { contenido } };
        case 'PIE_DE_PAGINA':
            return { Componente: SharedFooter, props: {} };
        case 'CONTACTO':
            return { Componente: Contacto, props: { contenido } };
        default:
            return { Componente: null, props: {} };
    }
};
