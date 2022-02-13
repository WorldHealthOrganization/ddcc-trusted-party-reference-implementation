# Introduction  
Keycloak as provided by quay.io is an identity and access management system (IAM) which will be used in context of the of the trusted party reference implementation as a client acccess provider.
It can also be used to manage the authentification to the vault system, which offers an option for an OIDC provider to manage access.
#### links:
[GitHub](https://github.com/keycloak/keycloak)

# Installation
Keycloak docker containers are provided by quay.io in the official docker registry. So no pull secret is necessary for accessing them.  
They can simply installed with the keycloak deploymenmt yaml file in the yaml subdirectory of this repository. 
``` bash
kubectl apply -f keycloak.yml
``` 
This assumes that the postgres database is already installed before.  

Upon first startup, keycloak will generate its database structure in the underlying database system.  

| Env Variable | Values | Purpose |
| :----------- | :----- | :----- |
| DB_VENDOR    | postgres/mysql | to select the right JDBC driver |
| DB_USER      | root   | the db user that can create table spaces, tables, views etc. |
| DB_PASSWORD  | [dbpassword] | password of the above db user |
| DB_DATABASE  | postgres | Database where keycloak will add its schema |
| DB_ADDR      | ip-address or DNS name | location of database service | 
| DB_PORT      | 5432 | port of the databse service |
|
 
The databse system is configured by the environment variable **DB_VENDOR** which is set to **postgres** in the provided yaml.  



# Remarks
Keycloak is subject to several bugfixes, that address the merely the underlying, somewhat outdated JBOSS EJB Container.  
So keeping an eye on updates every now and then is a good idea.  
Theoretically keycloak can use every database with a corresponding JDBC driver, the quay.io docker image provides **postgres** and **mysql** for DB_VENDOR
If no special database systems is provided, keycloak will use the packaged h2 in memory database system, which is suggested only for testing, as no data persistence exists
# Considerations
Instead of doing the TLS Termination in the ingress controller, it can be performed on service level in webserver (wildfly) of the keykloak system. This requires a more elaborated configuration of the keycloak system by editing the server configuration standalone.xml or 
