# Introduction
PGAdmin is not part of the actual trusted party reference implementation but is more a means to manange the databse on a low level base, giving a convenient way to analyse bugs and manage content.
# Installation
As prerequisites the postgres db user name and their password must be as a k/v secret in the vault.
A role with the right to read this secret must be bound the to serviceaccount, that is installed during the following steps.
Please find useful information about vault configuration under [Hashicorp Vault](../docs/HASHICORPVAULT.md)  
After the vault is prepared
pgadmin is installed from the docker image on docker hub via the yaml files under [pgadminui](../kubernetes/yml/pgadminui/).
The following commands will do the installation:  
```bash
kubectl apply -f deployment.yml
kubectl apply -f ingress.yml
kubectl apply -f service.yml
kubectl apply -f serviceaccount.yml
```

The pgadmin ui can then be reached under the domain registered for the service' eIP and given in the ingreas' host name.
Database connections can be configured completely via pgadmins' ui. All configurations are stored with pgadmin.
The admin user can login from different places at the same time having an individual session.
# Remarks

# Considerations
