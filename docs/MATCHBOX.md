# Installation

To install the [matchbox server](https://github.com/ahdis/matchbox), the container can be created by using

``` bash
kubectl apply -f matchbox/deployment.yml
``` 

This assumes that the postgres database is already installed before and the secrets/roles are created within the vault.  

