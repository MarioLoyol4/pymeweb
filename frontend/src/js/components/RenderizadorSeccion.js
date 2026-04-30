import { Logo } from '../../components/secciones/Logo';
import { Cabecera } from '../../components/secciones/Cabecera';
import { Acerca_nosotros } from '../../components/secciones/Acerca_nosotros';
import { BarraMenu } from '../../components/secciones/Barra_menu';
import { Servicios } from '../../components/secciones/Servicios';

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
        default:
            return { Componente: null, props: {} };
    }
};
