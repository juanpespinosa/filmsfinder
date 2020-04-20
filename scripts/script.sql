CREATE DATABASE que_veo_hoy;

use que_veo_hoy;

CREATE TABLE IF NOT EXISTS pelicula (
    id INT(10) NOT NULL AUTO_INCREMENT,
    titulo VARCHAR(100),
    anio INT(5),
    duracion INT(5),
    director VARCHAR(400),
    fecha_lanzamiento DATE,
    puntuacion INT(2),
    poster VARCHAR(300),
    trama VARCHAR(700),
    PRIMARY KEY(id)
);

SOURCE script-paso-1-peliculas.sql;

CREATE TABLE IF NOT EXISTS genero (
    id INT(10) NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(30),
    PRIMARY KEY(id)
);

ALTER TABLE pelicula ADD COLUMN genero_id INT(10) NOT NULL;
ALTER TABLE `que_veo_hoy`.`pelicula` 
ADD INDEX `id_idx` (`genero_id` ASC) VISIBLE;
;
ALTER TABLE `que_veo_hoy`.`pelicula` 
ADD CONSTRAINT `id`
  FOREIGN KEY (`genero_id`)
  REFERENCES `que_veo_hoy`.`genero` (`id`)
;

SOURCE script-paso-2-generos.sql;

CREATE TABLE IF NOT EXISTS actor (
  id int(10) NOT NULL auto_increment,
  nombre varchar(70),
  PRIMARY KEY (id)
  );

 CREATE TABLE IF NOT EXISTS actor_pelicula (
    id int(10) NOT NULL auto_increment,
    actor_id int (10),
    pelicula_id int (10),
    PRIMARY KEY (id),
    FOREIGN KEY (actor_id) REFERENCES actor (id),
    FOREIGN KEY (pelicula_id) REFERENCES pelicula (id)
);

SOURCE script-paso-3-actores.sql;