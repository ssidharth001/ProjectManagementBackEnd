CREATE DATABASE Project_management_dashboard;
USE Project_management_dashboard;

#--- Table Creation -----------------------------------------#
CREATE TABLE Projects (id INT NOT NULL AUTO_INCREMENT, projectName VARCHAR(100), clientName VARCHAR(100), projectManager VARCHAR(50), projectStatus VARCHAR(7), startDate DATE,
endDate DATE, progress INT, description VARCHAR(500), PRIMARY KEY (id));
CREATE TABLE Resources (id INT NOT NULL AUTO_INCREMENT, name VARCHAR(40), email VARCHAR(50), role VARCHAR(20), PRIMARY KEY(id));
CREATE TABLE Technologies (id INT NOT NULL AUTO_INCREMENT, name VARCHAR(20), PRIMARY KEY(id));
CREATE TABLE Status_reports (id INT NOT NULL AUTO_INCREMENT, project_id INT,date DATE, resource_id INT, activityType VARCHAR(30),
workHours INT, PRIMARY KEY(id), FOREIGN KEY(project_id) REFERENCES Projects(id), FOREIGN KEY(resource_id) REFERENCES Resources(id));

CREATE TABLE Project_tech_map (id INT NOT NULL AUTO_INCREMENT, project_id INT, tech_id INT,
PRIMARY KEY(id), FOREIGN KEY(project_id) REFERENCES Projects(id), FOREIGN KEY(tech_id) REFERENCES Technologies(id) );
CREATE TABLE Project_resource_map (id INT NOT NULL AUTO_INCREMENT, project_id INT, resource_id INT, billable BOOL, ratePerHour INT,
PRIMARY KEY(id), FOREIGN KEY(project_id) REFERENCES Projects(id), FOREIGN KEY(resource_id) REFERENCES Resources(id) );

#--- Seeding the tables --------------------------------------#
INSERT INTO Projects ( projectName , clientName , projectManager, projectStatus, startDate, endDate, progress, description) VALUES ('XYZ Project', 'XYZ','Roy Miller','Open','2020-01-01',
'2020-11-01','80',"Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero's De Finibus Bonorum et Malorum for use in a 
type specimen book."), 
('ABC Project', 'ABC','John Smith','Open','2020-03-01','2020-12-01','60',"Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero's De Finibus Bonorum et Malorum for use in a 
type specimen book.");

INSERT INTO Resources (name,email,role) VALUES ('Thejus', 'thejuss@qburst.com', 'Engineer'), ('Nikhil', 'nikhil@qburst.com', 'Engineer'),
('Sidharth', 'sidharth@qburst.com', 'Engineer'),('Ann', 'ann@qburst.com', 'Manager'),('Haripriya', 'haripriya@qburst.com', 'Manager'),
('Ananya', 'ananya@qburst.com', 'Manager');

INSERT INTO Project_resource_map (project_id,resource_id,billable,ratePerHour) VALUES (1,1,true,200),(1,4,true,300),(1,3,false,0),
(2,3,true,200),(2,5,true,500);

INSERT INTO Technologies (name) VALUES ('HTML'),('CSS'),('JavaScript'),('Java');

INSERT INTO Project_tech_map (project_id,tech_id) VALUES (1,1),(1,2),(2,1),(2,2),(2,3);


SELECT JSON_ARRAYAGG(name) AS technologies FROM Technologies;
SELECT Projects.id AS projectId, projectName , clientName , projectManager, projectStatus, startDate, endDate, progress, description, JSON_ARRAYAGG(Technologies.name) as technologies FROM Projects JOIN Project_tech_map ON Projects.id = Project_tech_map.project_id JOIN Technologies ON Project_tech_map.tech_id = Technologies.id GROUP BY Projects.id;
