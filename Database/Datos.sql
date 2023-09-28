USE `marvel_movies`;

-----     -----     -----     -----     -----     Catalogos     -----     -----     -----     -----     -----
--  classifications  --
insert into classifications (id, name, description, created_at, updated_at) values (1, 'Infantil', 'Infantil', '2023-05-20', '2023-06-22');
insert into classifications (id, name, description, created_at, updated_at) values (2, '+18', '+18', '2023-05-27', '2023-08-19');
insert into classifications (id, name, description, created_at, updated_at) values (3, '+16', '+16', '2023-09-22', '2022-12-30');
insert into classifications (id, name, description, created_at, updated_at) values (4, 'Adultos', 'Adultos', '2023-08-01', '2023-07-25');
insert into classifications (id, name, description, created_at, updated_at) values (5, 'Comic', 'Commic', '2023-06-24', '2023-06-24');

--  genres  --
insert into genres (id, name, description, created_at, updated_at) values (1, 'Comedia', 'Comedia', '2023-05-20', '2023-06-22');
insert into genres (id, name, description, created_at, updated_at) values (2, 'Drama', 'Drama', '2023-05-27', '2023-08-19');
insert into genres (id, name, description, created_at, updated_at) values (3, 'Suspenso', 'Suspenso', '2023-09-22', '2022-12-30');
insert into genres (id, name, description, created_at, updated_at) values (4, 'Terror', 'Terror', '2023-08-01', '2023-07-25');
insert into genres (id, name, description, created_at, updated_at) values (5, 'Accion', 'Accion', '2023-06-24', '2023-06-24');

--  roles  --
insert into roles (id, name, description, created_at, updated_at) values (1, 'Administrador', 'Administrador', '2023-05-20', '2023-06-22');
insert into roles (id, name, description, created_at, updated_at) values (2, 'Supervisor', 'Supervisor', '2023-05-27', '2023-08-19');
insert into roles (id, name, description, created_at, updated_at) values (3, 'Empleado', 'Empleado', '2023-09-22', '2022-12-30');
insert into roles (id, name, description, created_at, updated_at) values (4, 'Suscriptor', 'Suscriptor', '2023-08-01', '2023-07-25');
insert into roles (id, name, description, created_at, updated_at) values (5, 'Cliente', 'Cliente', '2023-06-24', '2023-06-24');

-----     -----     -----     -----     -----     Transaccionales     -----     -----     -----     -----     -----
--  movies  --
insert into movies (id, name, genreId, length, year, classificationId, description, contentWarning, director, cast, studio, price, image, subtitles, created_at, updated_at) values (1, 'ncasserly0', 1, 78, 2023, 1, 'mkelledy0', 'alarmett0', 'hlemmon0', 'btavinor0', 'bhughlin0', 321.73, 'dlovart0', 'ldiruggiero0', '2023-03-13', '2023-02-20');
insert into movies (id, name, genreId, length, year, classificationId, description, contentWarning, director, cast, studio, price, image, subtitles, created_at, updated_at) values (2, 'skingdon1', 2, 101, 2016, 2, 'eboutellier1', 'candover1', 'inewcombe1', 'bmacklam1', 'saylmer1', 286.19, 'cishchenko1', 'rready1', '2023-05-06', '2023-08-01');
insert into movies (id, name, genreId, length, year, classificationId, description, contentWarning, director, cast, studio, price, image, subtitles, created_at, updated_at) values (3, 'rlamy2', 3, 210, 2018, 3, 'aeyree2', 'scrawcour2', 'ealessandretti2', 'hpickles2', 'cohickee2', 238.92, 'dearp2', 'afishe2', '2023-09-17', '2022-12-28');
insert into movies (id, name, genreId, length, year, classificationId, description, contentWarning, director, cast, studio, price, image, subtitles, created_at, updated_at) values (4, 'pdybell3', 4, 217, 2009, 4, 'gcumbridge3', 'ssedgmond3', 'nchristofides3', 'oforgie3', 'tkitson3', 203.27, 'randor3', 'ctythe3', '2023-02-24', '2023-05-22');
insert into movies (id, name, genreId, length, year, classificationId, description, contentWarning, director, cast, studio, price, image, subtitles, created_at, updated_at) values (5, 'dschinetti4', 5, 310, 2004, 5, 'svereker4', 'emacallen4', 'esaltwell4', 'srachuig4', 'lcrole4', 212.16, 'agallie4', 'tbrownbill4', '2023-01-13', '2022-11-25');

--  users  --
insert into users (id, name, mail, roleId, password, image, created_at, updated_at) values (1, 'Diego Villarroel', 'diego.villarroel@dh.com', 1, 'password1', '', '2023-07-14', '2023-01-14');
insert into users (id, name, mail, roleId, password, image, created_at, updated_at) values (2, 'Victoria Soto', 'victoria.soto@dh.com', 1, 'password2', '', '2023-03-30', '2023-02-11');
insert into users (id, name, mail, roleId, password, image, created_at, updated_at) values (3, 'Edilberto Espinosa', 'edilberto.espinosa@dh.com', 1, 'password3', '', '2023-09-01', '2023-09-03');
insert into users (id, name, mail, roleId, password, image, created_at, updated_at) values (4, 'Ismael Rojas', 'ismael.rojas@dh.com', 1, 'password4', '', '2022-11-06', '2022-10-06');
insert into users (id, name, mail, roleId, password, image, created_at, updated_at) values (5, 'victoria', 'victoria@digitalhouse.com', 5, '$2a$10$oo3S6SvlCZIA8y1Uk1GqAecvpDUlIHOT5aw.g63Fi4FjBoAnQN/fS', '/images/user-images/usuario-1691700701547.jpg', '2023-03-24', '2023-02-04');
insert into users (id, name, mail, roleId, password, image, created_at, updated_at) values (6, 'kmacfayden0', 'awiddows0@list-manage.com', 1, 'rmugg0', 'mneal0', '2023-07-14', '2023-01-14');
insert into users (id, name, mail, roleId, password, image, created_at, updated_at) values (7, 'ctrustie1', 'oboik1@jalbum.net', 2, 'mfellnee1', 'paizikov1', '2023-03-30', '2023-02-11');
insert into users (id, name, mail, roleId, password, image, created_at, updated_at) values (8, 'mcarvilla2', 'cwasling2@chronoengine.com', 3, 'hskeffington2', 'nwinkle2', '2023-09-01', '2023-09-03');
insert into users (id, name, mail, roleId, password, image, created_at, updated_at) values (9, 'gcadogan3', 'rmccawley3@webmd.com', 4, 'esomerlie3', 'ffearnyhough3', '2022-11-06', '2022-10-06');
insert into users (id, name, mail, roleId, password, image, created_at, updated_at) values (10, 'rbunker4', 'swaldren4@issuu.com', 5, 'edenny4', 'hratt4', '2023-03-24', '2023-02-04');
