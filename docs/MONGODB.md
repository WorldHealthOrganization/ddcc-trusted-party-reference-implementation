# Installation

To install a basic mongodb, the container can be created by using

``` bash
kubectl apply -f mongodb/deployment.yml
``` 

If a replica set setup is wished, consider the [mongodb documentation](https://docs.mongodb.com/v3.4/replication/). This kind of setup may require an different kind of machine setup. 
