# Installation

To install the [fhir server](https://github.com/hapifhir/hapi-fhir), the container can be created by using

``` bash
kubectl apply -f hapifhir/deployment.yml
``` 
This assumes that the postgres database is already installed before and the secrets/roles are created within the vault.  





