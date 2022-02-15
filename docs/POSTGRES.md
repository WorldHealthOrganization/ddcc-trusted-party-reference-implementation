# Installation

At first, create for the database an volume and an volume claim by using the following command:

```bash

```

Before doing the deployment, create an service account by using the serviceaccount.yml and link it within the vault to make the secrets accessible. The deployment can be made then for example by using: 

```bash
kubectl apply -f postgres-fhir/deployment.yml
```

Deploy in every case an service for the database to make it accessible within the cluster:


```bash
kubectl apply -f postgres-fhir/service.yml
```

When the service is deployed you can use it over {service name}.svc.cluster.local e.g. postgres-fhir.svc.cluster.local. This  can be used for instance for adding it to the application or pg-admin for administration.

### Links

[Installation How To](https://severalnines.com/database-blog/using-kubernetes-deploy-postgresql)

# Remarks

The vault supports an auto rotation of database keys, which is currently not configured. From security perspective is it much more secure, but from operations perspective can it be tricky, when the admin credenitials changing from time to time. Choose the operations mode according your local polices. 
# Considerations

Currently is in the cluster a single database used for each use case (FHIR,Keycloak etc.), because it follows a micro service approach. If for instance a managed postgres database is used within the cluster it may makes sense to reconfigure the components by choosing the same database but different database names. Then all databases are collected into one server which simplifies the management. 