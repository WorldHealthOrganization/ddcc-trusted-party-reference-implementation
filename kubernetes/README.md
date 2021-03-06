# Introduction

This readme gives an overview what considerations must be done during the setup of a kubernetes cluster with the selected components.

# Ingress Controller

## Overview

The choice of an [ingress controller](https://kubernetes.io/docs/concepts/services-networking/ingress-controllers/) depends on the necessary functionality. Each of the ingress controllers deliver more or less basic functionality, but in detail the differ a lot. In the created cluster the nginx ingress controller was used, because it offers a set of features which fit perfectly to the use cases. For instance, client-auth, CORS support and others.  

For seperation/HA or traffic purposes it may be necessary to install [multiple purposes](https://docs.nginx.com/nginx-ingress-controller/installation/running-multiple-ingress-controllers/)

## Annotations

To enable the ingress controller features, annotations must be set within the ingress route. For the nginx controller the annotations can be found [here](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/annotations/). 

## DNS Hosts

To integrate later on TLS certificates, each ingress route should be set on one or more DNS hosts adresses. This can be created within the available DNS zones as alias for the Public IP adress or as seperate DNS entry for one domain. Is an custom DNS name used, it may be required to add the Plattform DNS servers to the domain name resolution. 

## Cert Manager

Is the ingress route and the DNS name created, the cert manager can be installed. Over [annotations](https://cert-manager.io/v0.14-docs/tutorials/acme/ingress/) in the ingress route, the certmanager can generate automatically let's encrypt certificates to protect the route via SSL.

<b>Note</b>: The certmanager can only generate Certificates for Hosts that are reachable over the dns host name. Wildcard certificates are possible, but the challenge provider within the certmanager needs to be replaced by [DNS01](https://cert-manager.io/docs/configuration/acme/dns01/). In some secenarios it may be also usefull to use the vault PKI for issuing certificates([Link](https://cert-manager.io/docs/configuration/vault/)). 

## Security

To protect ingress routes, there are some options which can be enabled: 

- [Client Authenctication](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/annotations/#client-certificate-authentication)
- [IP Whitelisting](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/annotations/#whitelist-source-range)
- [External Auth](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/annotations/#external-authentication)

Additionally the ingress can be protected against DDOS Attacks with an [rate limiter](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/annotations/#rate-limiting).

## CORS

When an ingress route is hosted, which shall deliver content to an webiste, it's necessary to enable the CORS features. Otherwise the Browsers will block the communication to the route when the host is different to the origin. This can be enabled by [enabling CORS](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/annotations/#enable-cors) and the setting of the Allowed Origins and Methods. 

# Secret Injection

The vault is able to [inject secrets](https://www.vaultproject.io/docs/platform/k8s/injector) directly into a starting pod. This can be configured over annotations within the pod/template. The injector can create files directly. For environment variables there must an additional command added to set them into the pod after injection. 

If the injection is used, ensure that the correct role ist set and that the role has the correct rights for the requests secret within the vault. Otherwise the vault injector will respond with permission denied. 

# Vault Secrets

To use the secrets in the vault, several steps are required to make the secrets accessible from outside. First of all, the kubernetes authentication method must be enabled. Follow the instructions [here](https://www.vaultproject.io/docs/auth/kubernetes) precisly. Use the command line within the cluster, because the vault UI don't provide all necessary parameters. 

After the setup of the kubernetes auth, generate simply for all containers, which needs an injection or access to a secret, a service account and add it via serviceaccount attribute to the yml. Within the vault, you can generate an secret engine (e.g. k/v) and a policy for it. Consider that the path for the polices is defined as {engineName}/data/{secretname}. For instance postgresdb/data/fhir. After creating this in the vault, the access can be defined. Create fur this purpose a role within the kubernetes auth, which matches precisly to the role defined in the injector annotation. Declare within the role the default namespace, the used service account and the used policy. The injector injects then the file with the secrets to the path /vault/secrets/{choosen name}. More detail about the injection can be found [here](https://github.com/WorldHealthOrganization/ddcc-trusted-party-reference-implementation/blob/master/docs/HASHICORPVAULT.md)

