// Objeto Estudiante:
function Estudiante(codigo, nombre, nota) {
    this.codigo = codigo;
    this.nombre = nombre;
    this.nota = nota;
}

// Módulo que agrupa las funciones realacionadas con el sistema:
var gestor = {
    estudiantes: [],
    Edicion: false,
    init: function () {
        $('#registroEstudiante').on('click', this.registrarEstudiante);
        $('#calculoPromedio').on('click', this.calcularNotaPromedio);
        $('#calculoNotaMayor').on('click', this.calcularNotaMayor);
        $('#calculoNotaMenor').on('click', this.calcularNotaMenor);

        this.cargarEstudiantes();
    },
    registrarEstudiante: function () {
        var codigo = $('#codigo');
        var nombre = $('#nombre');
        var nota = $('#nota');

        if (!gestor.Edicion) {

            if (codigo.val() && nombre.val() && nota.val()) {
                if (parseInt(codigo.val()) > 0) {
                    if (parseFloat(nota.val()) >= 0 && parseFloat(nota.val()) <= 10.0) {
                        if (!gestor.estudianteExiste(codigo.val())) {
                            var nuevoEstudiante = new Estudiante(parseInt(codigo.val()), nombre.val(), parseFloat(nota.val()));
                            localStorage.setItem(codigo.val(), JSON.stringify(nuevoEstudiante));

                            var notasTBody = $('#notas');

                            var nuevoTr = $('<tr>');

                            var idTd = $('<td>');
                            idTd.text(nuevoEstudiante.codigo);
                            nuevoTr.append(idTd);

                            var nombreTd = $('<td>');
                            nombreTd.text(nuevoEstudiante.nombre);
                            nuevoTr.append(nombreTd);

                            var notaTd = $('<td>');
                            notaTd.text(nuevoEstudiante.nota);
                            nuevoTr.append(notaTd);

                            var tdBtnEditar = $('<td>');
                            var btnEditar = $('<button>');
                            btnEditar.text('Editar');
                            btnEditar.click({codigo: nuevoEstudiante.codigo}, gestor.editarEstudiante);
                            tdBtnEditar.append(btnEditar);
                            nuevoTr.append(tdBtnEditar);

                            var tdBtnEliminar = $('<td>');
                            var btnEliminar = $('<button>');
                            btnEliminar.text('Eliminar');
                            btnEliminar.click({codigo: nuevoEstudiante.codigo}, gestor.eliminarEstudiante);
                            tdBtnEliminar.append(btnEliminar);
                            nuevoTr.append(tdBtnEliminar);

                            notasTBody.append(nuevoTr);
                        } else {
                            alert('Un estudiante con el código ' + String(codigo.val()) + ' ya existe.');
                        }
                    } else {
                        alert('La nota debe estar entre 0.0 y 10.0');
                    }
                } else {
                    alert('El código debe ser positivo');
                }
            } else {
                alert('Todos los campos son obligatorios');
            }
        } else {
            gestor.Edicion = false;
            $('#codigo').attr('disabled', false);

            var estudianteModificado = new Estudiante(parseInt(codigo.val()), nombre.val(), parseFloat(nota.val()));
            localStorage.setItem(codigo.val(), JSON.stringify(estudianteModificado));
            gestor.cargarEstudiantes();
        }

        gestor.limpiarCampos();
    },
    cargarEstudiantes: function () {
        var notasTBody = $('#notas');
        notasTBody.empty();

        for (var i = 0; i < localStorage.length; ++i) {
            var estudiante = JSON.parse(localStorage.getItem(localStorage.key(i)));

            var nuevoTr = $('<tr>');

            var idTd = $('<td>');
            idTd.text(estudiante.codigo);
            nuevoTr.append(idTd);

            var nombreTd = $('<td>');
            nombreTd.text(estudiante.nombre);
            nuevoTr.append(nombreTd);

            var notaTd = $('<td>');
            notaTd.text(estudiante.nota);
            nuevoTr.append(notaTd);

            var tdBtnEditar = $('<td>');
            var btnEditar = $('<button>');
            btnEditar.text('Editar');
            btnEditar.click({codigo: estudiante.codigo}, gestor.editarEstudiante);
            tdBtnEditar.append(btnEditar);
            nuevoTr.append(tdBtnEditar);

            var tdBtnEliminar = $('<td>');
            var btnEliminar = $('<button>');
            btnEliminar.text('Eliminar');
            btnEliminar.click({codigo: estudiante.codigo}, gestor.eliminarEstudiante);
            tdBtnEliminar.append(btnEliminar);
            nuevoTr.append(tdBtnEliminar);

            notasTBody.append(nuevoTr);
        }
    },
    calcularNotaPromedio: function () {
        var sumaNotas = 0.0;

        for (var i = 0; i < localStorage.length; ++i) {
            var estudiante = JSON.parse(localStorage.getItem(localStorage.key(i)));

            sumaNotas += estudiante.nota;
        }

        alert("La nota promedio es: " + (sumaNotas / localStorage.length).toFixed(2));
    },
    calcularNotaMayor: function () {
        var indiceNotaMayor = 0;
        var notaMayor = JSON.parse(localStorage.getItem(localStorage.key(0))).nota;

        for (var i = 1; i < localStorage.length; ++i) {
            if (JSON.parse(localStorage.getItem(localStorage.key(i))).nota > notaMayor) {
                notaMayor = JSON.parse(localStorage.getItem(localStorage.key(i))).nota;
                indiceNotaMayor = i;
            }
        }

        alert("El estudiante " + JSON.parse(localStorage.getItem(localStorage.key(indiceNotaMayor))).nombre + " tiene la nota mayor: " + notaMayor);
    },
    calcularNotaMenor: function () {
        var indiceNotaMenor = 0;
        var notaMenor = JSON.parse(localStorage.getItem(localStorage.key(0))).nota;

        for (var i = 1; i < localStorage.length; ++i) {
            if (JSON.parse(localStorage.getItem(localStorage.key(i))).nota < notaMenor) {
                notaMenor = JSON.parse(localStorage.getItem(localStorage.key(i))).nota;
                indiceNotaMenor = i;
            }
        }

        alert("El estudiante " + JSON.parse(localStorage.getItem(localStorage.key(indiceNotaMenor))).nombre + " tiene la nota menor: " + notaMenor);
    },
    estudianteExiste: function (codigo) {
        for (var i = 0; i < localStorage.length; ++i) {
            if (codigo === localStorage.key(i)) {
                return true;
            }
        }

        return false;
    },
    eliminarEstudiante: function (evt) {
        if (confirm("¿Está seguro que quiere eliminar este registro de estudiante?")) {
            localStorage.removeItem(evt.data.codigo);
            gestor.cargarEstudiantes();
        }
    },
    editarEstudiante: function (evt) {
        gestor.Edicion = true;
        $('#codigo').attr('disabled', true);

        $('#codigo').val(evt.data.codigo);

        var estudiante = JSON.parse(localStorage.getItem(evt.data.codigo));

        $('#nombre').val(estudiante.nombre);
        $('#nota').val(estudiante.nota);
    },
    limpiarCampos: function(){
        $('#codigo').val('');
        $('#nombre').val('');
        $('#nota').val('');
    }
};

gestor.init();