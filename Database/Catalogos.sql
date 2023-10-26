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

