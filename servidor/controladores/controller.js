var con = require("../lib/conexionbd");

function listarPeliculas(req, res) {
  var sql = "SELECT * FROM pelicula";
  var consulta = 'SELECT * FROM pelicula';
  var totalResultados = 0;
 // var filtro = Object.keys(req.query);
  var filters = [];
  let pagina = req.query.pagina;
  let cantidad = req.query.cantidad;

  if (req.query.anio) {
    filters.push('anio = ' + req.query.anio)
  }

  if (req.query.titulo) {
    filters.push("titulo LIKE" + " '%" + req.query.titulo + "%'")
  }

  if (req.query.genero) {
    filters.push('genero_id = ' + req.query.genero)
  }

  if (filters.length > 0) {
    sql += '  WHERE ' + filters.join(' AND ');
  }

  if (req.query.columna_orden) {
    sql += ' ORDER BY ' + req.query.columna_orden + ' ' + req.query.tipo_orden;
    console.log();
  }

  if (pagina) {
    sql += ' LIMIT ' + (pagina - 1) * cantidad + ',' + cantidad;
  }

  con.query(consulta, function(error, resultado, fields) {
    if(error) {
      console.log("Hubo un error en la consulta", error.message);
      return res.status(404).send("Hubo un error en la consulta");
    }
    totalResultados = resultado.length;
  });

    con.query(sql, function(error, resultado) {
    // Si hubo un error, se informa y se envia un mensaje de error
    if (error) {
      console.log("Hubo un error en la consulta", error.message);
      return res.status(404).send("Hubo un error en la consulta");
    }
    var respuesta = {
      peliculas: resultado,
      total: totalResultados
    };
    res.send(JSON.stringify(respuesta));
  });
}

function listarGeneros(req, res) {
    var sql = "SELECT * FROM genero";
    con.query(sql, function(error, resultado) {
        if (error) {
            console.log("Hubo un error en la consulta", error.message);
            return res.status(404).send("Hubo un error en la consulta");
        }
        var respuesta = {
            generos: resultado
        };
        res.send(JSON.stringify(respuesta));
    });
}

function buscarPeliculasPorId (req, res) {
  let id = req.params.id;
  let sql = "SELECT p.titulo, p.duracion, p.trama, p.director, p.anio, p.fecha_lanzamiento, p.puntuacion, p.poster, a.nombre as actores, g.nombre FROM pelicula p JOIN genero g ON p.genero_id = g.id JOIN actor_pelicula ap ON p.id = ap.pelicula_id JOIN actor a ON ap.actor_id = a.id WHERE p.id = '" + id + "'"

  //var sql = "SELECT p.titulo, p.duracion, p.trama, p.director, p.anio, p.fecha_lanzamiento, p.puntuacion, p.poster, g.nombre, a.nombre FROM pelicula p, actor a, actor_pelicula ap, genero g WHERE p.id = " + id + " AND p.genero_id = g.id and p.id = ap.pelicula_id and ap.actor_id = a.id"
  con.query(sql, function(error, resultado) {
    if(error){
      console.log("Hubo un error en la consulta.", error.message);
      return res.status(404).send("Hubo un error en la consulta.");
    }
    if (resultado.length === 0) {
      console.log("No se encontró ninguna pelīcula con ese id.");
      return res.status(404).send("No se encontró ninguna pelīcula con ese id.")
    } else {
      var respuesta = {
        'pelicula': resultado[0],
        'genero': resultado[0],
        'actores': resultado,
      };

      res.send(JSON.stringify(respuesta));
    }
  });
}

function buscarRecomendaciones (req, res) {
  var sql = "SELECT p.id, p.anio, p.titulo, p.fecha_lanzamiento, p.duracion, p.trama, p.director, p.puntuacion, p.poster, g.nombre as nombre, g.id as genero_id from pelicula p join genero g on p.genero_id = g.id";
  let genero = req.query.genero;
  let anioInicio = req.query.anio_inicio;
  let anioFin = req.query.anio_fin;
  let puntuacion = req.query.puntuacion;
  let filters = [];

 if (genero) {
   filters.push("g.nombre = " + "'" + genero + "'");
 }

 if (anioInicio && anioFin) {
   filters.push("p.anio BETWEEN " + anioInicio + " AND " + anioFin);
 }

 if (puntuacion) {
   filters.push("p.puntuacion = " + puntuacion);
 }

 if (filters.length > 0) {
 sql += " WHERE " + filters.join(" AND ");
 }

 if (filters.length = 0) {
  sql += " JOIN genero g on p.genero_id = g.id";
  }

 con.query(sql, function(error, resultado) {
  if (error) {
      console.log("Hubo un error en la consulta", error.message);
      return res.status(500).send("Hubo un error en la consulta");
  }
  var respuesta = {
      peliculas: resultado
  };
  res.send(JSON.stringify(respuesta));
});
}

  module.exports = {
    listarPeliculas: listarPeliculas,
    listarGeneros: listarGeneros,
    buscarRecomendaciones: buscarRecomendaciones,
    buscarPeliculasPorId: buscarPeliculasPorId
  };