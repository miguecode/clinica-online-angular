# 🏥 Clínica Online - Sitio Web

Este proyecto es un sitio web desarrollado con Angular. Fue creado en 2024 y simula la interfaz y el funcionamiento básico de una clínica online. Utiliza los servicios de Google Firebase.

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

### 👥 Entidades principales

- 🤒 **Paciente**: Un paciente podrá ver los datos de su **perfil**, solicitar un **turno** y ver la lista de sus **turnos solicitados**. A la hora de solicitar uno, tendrá que especificar la **especialidad**, el **especialista** y la **fecha**. En la sección de turnos, va a poder **cancelar** alguno si es que aún no fue completado o rechazado (dando su justificación), **calificar** la atención, y completar una **encuesta**.

- 👨‍⚕️ **Especialista**: Un especialista podrá ver los datos de su **perfil**, y acceder a su **lista de sus turnos**. En esta sección, tendrá la posibilidad de **aceptar**, **rechazar**, **cancelar** o **dar por finalizado** un turno. Cada una de estas acciones requerirán adjuntar un **comentario o diagnóstico** al respecto. En su perfil, además de ver sus datos, también tendrá la opción de **configurar su disponibilidad horaria**, eligiendo qué días puede trabajar, y a qué horarios especificos con un margen de **30 minutos** cada uno. Este tipo de usuario tiene la particularidad de que para poder acceder a la web, tendrá que **esperar a que un Administrador lo habilite**.

- 👨‍💼 **Administrador**: Un administrador podrá ver los datos de su **perfil**, y acceder a la **lista completa de turnos**. En esta sección, podrá **cancelar** el turno que quiera, siempre y cuando no esté en una etapa avanzada. También tendrá acceso a la **gestión de usuarios**. En ella, verá los **datos** de cada uno de ellos, y una opción para **habilitar** o **deshabilitar** a los especialistas. Por último, en esta sección va a poder **crear nuevos usuarios** de cualquier tipo. **Incluso administradores**.














---



---

## 🖥️ Pantallas principales

- Bienvenida

  <img src="https://github.com/Leumig/clinica-online-angular/assets/103081146/3883d139-3b50-47f9-be0e-a53945a76dc5" width="510"/>

  La primer pantalla de la aplicación. Se pueden ver los botones para iniciar sesión y registrarse. También podemos ver un navbar con distintos accesos rápidos, incluida una sección 'Sobre Mí'.

- Formulario de Ingreso

  <img src="https://github.com/Leumig/clinica-online-angular/assets/103081146/e0fa34f8-2521-4fc7-8d73-902fcfe6b170" width="510"/>

  Vemos 2 entradas: Correo y Clave. El botón de ingreso sólo se habilita cuando ambos campos están completados correctamente. Además, vemos una sección de accesos rápidos para agilizar el proceso de prueba.

- Formulario de Registro

  <img src="https://github.com/Leumig/clinica-online-angular/assets/103081146/e23afc0b-da93-44b9-a0ba-5122c2177e03" width="510"/>

  En primer instancia, vemos el registro diseñado para crear un paciente. Abajo tenemos la opción de cambiar al formulario de especialista. El botón de confirmación sólo se habilita cuando todos los campos están completados correctamente. Incluso el de la o las imagenes.

- Sobre Mí

  <img src="https://github.com/Leumig/clinica-online-angular/assets/103081146/981b59b6-e549-4fc2-8c18-527e85446241" width="510"/>

  Datos de mi perfil de GitHub. Los obtengo gracias a la API.

- Inicio como Paciente
  
  <img src="https://github.com/Leumig/clinica-online-angular/assets/103081146/c3ecd689-9674-4406-afd1-a45f78fb2f50" width="510"/>

  2 opciones disponibles para elegir: Mis turnos y Solicitar Turno.

- Inicio como Especialista

  <img src="https://github.com/Leumig/clinica-online-angular/assets/103081146/ba7f45ab-0ada-4788-abb9-5e4f25af6ae5" width="510"/>

  Una opción disponible para elegir: Mis turnos.

- Inicio como Administrador

  <img src="https://github.com/Leumig/clinica-online-angular/assets/103081146/0f0a18fb-10d4-49c2-ac77-af579c12caff" width="510"/>

  3 opciones disponibles para elegir: Gestión de Usuarios, Turnos y Asignar Turno.

- Mi Perfil

  <img src="https://github.com/Leumig/clinica-online-angular/assets/103081146/e3a5aff0-0b51-4280-b2bd-a72997134ee2" width="510"/>

  En este caso, vemos el ejemplo del perfil de un Paciente. Por eso aparecen 2 imagenes en vez de una. Esta sección es igual en los otros dos tipos de usuario, pero con sus otros datos específicos.

- Mi Perfil de Especialista

  <img src="https://github.com/Leumig/clinica-online-angular/assets/103081146/0b466e18-a74e-483e-bcda-4c92fd9b62a0" width="510"/>

  El perfil de especialista tiene la particularidad de tener una opción extra, que es la de configurar su disponibilidad horaria.

- Configurar disponibilidad horaria

  <img src="https://github.com/Leumig/clinica-online-angular/assets/103081146/2aff3ddb-d647-463f-9401-ff8c9911f8cf" width="510"/>

  El especialista elegirá entre los 6 días posibles, y sus respectivos horarios.

- Mis turnos

  <img src="https://github.com/Leumig/clinica-online-angular/assets/103081146/aae49f2c-c7ec-4efe-aa63-6f8739bc3d8a" width="510"/>

  En este caso, vemos el ejemplo de la sección basada en un paciente. Se muestra la información de cada turno, con la posibilidad de filtrar por especialidad y especialista. Si se ingresa desde un especialista, será lo mismo pero con el filtro de especialidad y paciente. Además de la información de cada turno, aparece una lista de acciones para cada uno. El paciente tendrá unas opciones, y el especialista otras. Para el administrador, lo mismo. Un filtro por especialidad y especialista, y las acciones disponibles.

- Solicitar Turno

  <img src="https://github.com/Leumig/clinica-online-angular/assets/103081146/f6124e93-82fb-4ae6-9ad2-8d514b0dd355" width="510"/>

  En este caso, vemos el ejemplo de la sección basada en un paciente. En ella, se podrá elegir cada elemento vital de un turno: la especialidad, el especialista, y la fecha. Dependiendo de qué especialidad se elija, se mostrarán los especialistas que la posean. Y las fechas serán las que el especialista tenga disponibles. En en el caso de la pantalla basada en administradores, será lo mismo pero con una selección extra: la del paciente.

- Gestión de Usuarios

  <img src="https://github.com/Leumig/clinica-online-angular/assets/103081146/b7dbdbe2-bff0-4c96-b908-8d5164e2bb22" width="510"/>

  Podemos ver la tabla con toda la información de cada usuario. Hay 2 botones grandes en forma de filtro. El primero representa a los pacientes y el segundo a los especialistas. Como en este caso se están mostrando los especialistas, en la tabla podemos ver una opción extra que es la de habilitar o deshabilitar. De esta forma el administrador maneja el estado de ese tipo de usuario. Y por último, podemos ver un botón de Crear Usuario. Eso lo lleva a la sección de registro, donde también podrá agregar otros administradores.






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

## 📌 Aclaraciones

- Fue creado en 2024, mientras cursaba la Tecnicatura Universitaria en Programación, en la UTN.
- La página podría llegar a actualizarse en un futuro, aunque no es uno de mis proyectos principales.
- El proyecto está bajo la licencia MIT.

## 🗃️ Otros proyectos similares
- [Playroom MG](https://github.com/Leumig/playroom-angular)
