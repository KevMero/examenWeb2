const mongoose = require('mongoose');
const axios = require("axios").default;
const cheerio = require("cheerio");
const cron = require("node-cron");
const express = require('express')
var bodyParser = require('body-parser');
const path = require('path')

const { MONGO_URI } = require("./config");

const conexion = MONGO_URI
const server = express();

server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

// conexion mongobd
mongoose.connect(conexion, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });


// modelos
const Docente = require("./models/docente");
const Cartelera = require("./models/cartelera");


// asignar puerto
var port = process.env.PORT || 9000;

// arrancar servidor
server.listen(port, () => {
  console.log(`Servidor corriendo en el puerto 9000`);
})


//Página estática 
server.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'views/tabla.html'))

})

//cron job
server.get('/cron-cinext', (req, res) => {
  cron.schedule("* * * * * *", async () => {
    console.log("Ejecucion exitosa");
    const html = await axios.get("https://www.cinextecuador.com/Browsing/Movies/NowShowing");
    const $ = cheerio.load(html.data);
    const titles = $(".item-title");
    titles.each((index, element) => {
      const pelicula = {
        pelicula: $(element).text().toString(),

      };
      Cartelera.create([pelicula]);
    });
  });
});


// servicios REST
// post - registrar docente
server.post('/api/docente', (req, res) => {
  const params = req.body;
  const docente = new Docente();

  if (params.docente) {

    // asignar valores
    docente.docente = params.docente;
    docente.periodo = params.periodo;
    docente.horas_docencia = params.horas_docencia;
    docente.horas_planificacion = params.horas_planificacion;
    docente.horas_tutorias = params.horas_tutorias;
    docente.horas_gestion = params.horas_gestion;
    docente.tipo_de_error = params.tipo_de_error;

    docente.save((err, datos) => {
      if (err) {
        return res.status(500).send({
          status: 'error',
          message: "No se pudo procesar"
        });

      }
      if (!datos) {
        return res.status(500).send({
          status: 'error',
          message: "Dato no guardado"
        });
      }
      else{
      // respuesta ok
      return res.status(200).send({ status: 'success', datos });
      }
    });
  } else {
    return res.status(200).send({ status: 'error', message: 'faltan datos por enviar' });
  }
})


// get - obtener todos los docentes
server.get('/api/docente', (req, res) => {

  Docente.find().exec((err, datos) => {
    if (err) {
      return res.status(500).send({
        status: 'error',
        message: 'no se pudo realizar la consulta'

      });

    }
    if (datos.length == 0) {

      return res.status(200).send({
        status: 'success',
        message: 'vacio'

      });

    }
    else{
    // respuesta ok
    return res.status(200).send({
      status: 'success',
      datos
    
    });}
    
  });
})


// get - obtener por filtros de error
server.get('/api/docente/:tipo', (req, res) => {

  Docente.find({ 'tipo_de_error': req.params.tipo }).exec((err, dato) => {
    if (err) {
      return res.status(500).send({
        status: 'error',
        message: 'no se pudo realizar la consulta'

      });
    }

    if (dato.length!==0) {

      return res.status(200).send({
        status: 'success',
        dato

      });


    } else {

      return res.status(200).send({
        status: 'success',
        message: 'vacio'

      });
    }

  });

})