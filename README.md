# 🏥 Clínica Online - Sitio Web

Este proyecto es un sitio web desarrollado con Angular. Simula la interfaz y el funcionamiento básico de una clínica online. Utiliza los servicios de Google Firebase.

**⭐ Link: [Clínica Online](clinica-online-f6245.web.app)**

## 📘 Descripción

Clínica Online es un sitio web hecho con Angular 17 que utiliza distintos servicios de Google Firebase. Simula ser una clínica online con acceso a distintos tipos de usuarios: Administradores, Especialistas y Pacientes. La idea principal del funcionamiento es que un paciente pueda solicitar su propio turno, y que un especialista lo administre.

## 🔑 Forma de Registro

Para registrarse, cada usuario tendrá que ingresar los siguientes datos en común:

- Correo (deberá validarlo)
- Clave (mínimo 6 caracteres)
- DNI (entre 7 y 9 caracteres)
- Nombre (mínimo 2 caracteres)
- Apellido (mínimo 2 caracteres)
- Edad (mínimo 1 año para pacientes, mínimo 20 para los demás)

Pero además, dependiendo el tipo de usuario, puede variar algún campo:

- El **paciente** debe ingresar su obra social, y 2 fotos.
- El **especialista** debe ingresar una o más especialidades, una foto, y más tarde configurar su disponibilidad.
- El **administrador** sólo debe agregar una foto y nada más.

Un requisito extra a la hora de registrarse, es que el usuario tendrá que **completar el reCaptcha**, en el cual va a validar que **no es un robot**. Y por último, una vez completado correctamente el formulario, se le enviará un **correo de confirmación** a la dirección de correo que haya ingresado el usuario. Ese correo tendrá un link con el fin de **validar** que es un correo existente.

## 👥 Entidades principales

- 🤒 **Paciente**: Un paciente podrá ver los datos de su **perfil** (los cuales puede descargar en PDF), solicitar un **turno** y ver la lista de sus **turnos solicitados**. A la hora de solicitar uno, tendrá que especificar la **especialidad**, el **especialista** y la **fecha**. En la sección de turnos, va a poder **cancelar** alguno si es que aún no fue completado o rechazado (dando su justificación), **calificar** la atención, y completar una **encuesta**.

- 👨‍⚕️ **Especialista**: Un especialista podrá ver los datos de su **perfil**, y acceder a su **lista de sus turnos**. En esta sección, tendrá la posibilidad de **aceptar**, **rechazar**, **cancelar** o **dar por finalizado** un turno. Cada una de estas acciones requerirán adjuntar un **comentario o diagnóstico** al respecto. En su perfil, además de ver sus datos, también tendrá la opción de **configurar su disponibilidad horaria**, eligiendo qué días puede trabajar, y a qué horarios especificos con un margen de **30 minutos** cada uno. Este tipo de usuario tiene la particularidad de que para poder acceder a la web, tendrá que **esperar a que un Administrador lo habilite**.

- 👨‍💼 **Administrador**: Un administrador podrá ver los datos de su **perfil**, y acceder a la **lista completa de turnos**. En esta sección, podrá **cancelar** el turno que quiera, siempre y cuando no esté en una etapa avanzada. También tendrá acceso a la **gestión de usuarios**. En ella, verá los **datos** de cada uno de ellos, y una opción para **habilitar** o **deshabilitar** a los especialistas. Por último, en esta sección va a poder **crear nuevos usuarios** de cualquier tipo. **Incluso administradores**. El Administrador también tendrá acceso a distintos gráficos y estadísticas de la clínica, y los podrá descargar en formato Excel.

## 🖥️ Pantallas principales

- Formulario de Registro

  En este caso, vemos el registro diseñado para crear un paciente. Abajo tenemos la opción de cambiar al formulario de especialista. El botón de confirmación sólo se habilita cuando todos los campos y el captcha están completados correctamente.
  
  <img src="https://github.com/Leumig/clinica-online-angular/assets/103081146/e23afc0b-da93-44b9-a0ba-5122c2177e03" width="720"/>

- Inicio como Paciente
  
  El menú es muy sencillo, el paciente tiene 2 opciones disponibles: Ver sus turnos o solicitar uno.

  <img src="https://github.com/Leumig/clinica-online-angular/assets/103081146/c3ecd689-9674-4406-afd1-a45f78fb2f50" width="720"/>

- Solicitar Turno

  En este menú el paciente solicitará su turno. Podrá elegir la especialidad, el especialista y la fecha. Dependiendo de qué especialidad se elija, se mostrarán los especialistas que la posean. Y las fechas que aparecen son las que el especialista tenga disponibles. Recordemos que los administradores también pueden crear o administrar turnos.

  <img src="https://github.com/Leumig/clinica-online-angular/assets/103081146/f6124e93-82fb-4ae6-9ad2-8d514b0dd355" width="720"/>
  
- Mis turnos

  Desde la vista de un paciente, se puede ver la información de cada turno, con la posibilidad de buscar por palabras clave como el nombre de la especialidad, el especialista, el día, el mes o el horario. Además de la información, aparece una lista de acciones para cada turno. El paciente tendrá unas opciones, y el especialista otras. Para el administrador, lo mismo.

  <img src="https://github.com/user-attachments/assets/34c2876b-5ce2-429b-892a-975bd2d27180" width="720"/>

- Configuración de horarios del especialista

  El especialista elegirá entre los 6 días posibles, y sus respectivos horarios.

  <img src="https://github.com/Leumig/clinica-online-angular/assets/103081146/2aff3ddb-d647-463f-9401-ff8c9911f8cf" width="720"/>

- Gestión de Usuarios

  Podemos ver la tabla con toda la información de cada usuario. Hay 2 botones grandes en forma de filtro. El primero representa a los pacientes y el segundo a los especialistas. Como en este caso se están mostrando los especialistas, en la tabla podemos ver una opción extra que es la de habilitar o deshabilitar. De esta forma el administrador maneja el estado de ese tipo de usuario. Tiene la opción de crear nuevos usuarios de cualquier tipo, y también puede descargar toda la lista de usuarios en Excel.

  <img src="https://github.com/user-attachments/assets/c7342fad-1eea-4469-a3a6-e7d00c3264dd" width="720"/>

- Gráficos y Estadísticas

  El Administrador puede ver cuatro gráficos en formato de "torta". Podrá descargarlos individualmente o todos a la vez, en formato Excel. Arriba también tiene una pequeña consola con el historial de los accesos al sistema.

  <img src="https://github.com/user-attachments/assets/0a096762-2b92-44c2-af98-cc8c71a73af1" width="720"/>

## 📋 Detalles técnicos

- 🔧 Framework y Lenguajes
  - 🅰️ Angular 17 (Typescript, HTML, CSS)
  - 🎨 Bootstrap
  - 🖌️ Estilos tomados de otras librerías como SweetAlert2 (para botones, componentes, fuentes, etc.).

- 🔐 Servicios
  - 🔑 Firebase Authentication
  - 🗄️ Firebase Firestore
  - 🌐 Firebase Hosting
  - 🤖 reCaptcha
- El proyecto está bajo la licencia MIT.

## 🗃️ Otros proyectos similares
- [Playroom MG](https://github.com/miguecode/playroom-angular)
