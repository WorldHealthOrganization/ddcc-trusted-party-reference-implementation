# Trusted Party Reference Implementation

## Introduction

This project shall give an best practise overview how an trusted party backend could be implemented to adapt the DDCC in the local infrastructure. All content is only for testing and study purposes and should not be copied 1:1 to production before appropiate technical,security and data privacy audits according to the local regulations and legal aspects/ needs. 

## Overview

## Security Considerations

When the cluster is up and running, it must be ensured that security relevant things are not accessible for unauthorized persons from outside. Each endpoint which must be exposed to public, should be evaluated carefully for the security needs. For instance all certificate generation endpoints or management endpoints of the system, should be protected either by client certificates or other appropiate protection mechanisms. How to grant people/issuers the rights to use this endpoints depends on the local regulations, processes and health care structures. Whatever issuing process is used, the usage of those endpoints should be monitored and audited to detect fraud and misuse early. 

Within the cluster, the most important point is to protect the private key material for signing certificate (also from internals). The amount of people with access to the siging infrastructure must be limited. It's recommended to split the signing/key material components out in a seperate environments to realize an organizational split. For instance in different accounts, different data centers or similiar. Need to know principles should also be respected for internal technical details or structures. 

If possible, all components used in the cluster should be seperated in different namespaces with additional security hardening in MicroVMs(e.g. [Kata](https://katacontainers.io)), Special Container Hardening (e.g. [Scone](https://scontain.com/index.html?lang=en)) or similiar. Not each of that techniques may be compatible with your local environment, because some of them require maybe special hardware as TPM modules or Intel SGX.

Check in every case the default [security advices](https://kubernetes.io/docs/tasks/administer-cluster/securing-a-cluster/).

## Kubernetes

The cluster can be set up in any kubernetes environment like k8s, k3s or [others](https://kubernetes.io/de/docs/setup/). From platform to platform can be deriviations which must be considered during the adaptation e.g. with the available ingress controllers, api gateways etc. The demo cluster remarks can be found in this [Readme](https://github.com/WorldHealthOrganization/ddcc-trusted-party-reference-implementation/blob/master/kubernetes/README.md)

In some environments, parts of the solution are already managed available. For instance managed postgres or managed mongoDB. If this is the case, the managed components should be prefered instead of operating dockerized components. A lot of vendors offering as well managed kubernetes platforms or PaaS systems which can cover already the most items which are necessary. 

Whatever is used, it must be well considered if the issuing of covid certificates and the handling of medical data is truthworthy and secure on the choosen platform. 

## Main Components

### Keycloak

The [keycloak](https://github.com/keycloak/keycloak) component is a widely used IAM system within open source solutions. It's in this solution used to provide user and client management functionalities. 

A installation guide can be found [here](https://github.com/WorldHealthOrganization/ddcc-trusted-party-reference-implementation/blob/master/docs/KEYCLOAK.md).

### Hashicorp Vault

The [hashicorp vault](https://github.com/hashicorp/vault) component was introduced to fullfill the following tasks: 

- Provision of a secret store which can be operational decoupled from the plattform operator
- Provision of a [secure encryption/signing engine](https://learn.hashicorp.com/tutorials/vault/eaas-transit) which can be potentially enhanced by an [HSM](https://www.vaultproject.io/docs/enterprise/hsm)
- Provision of a basic [PKI](https://learn.hashicorp.com/tutorials/vault/pki-engine) for creating and storing certificates

In a future version, the vault can also be enhanced by [plugins](https://www.vaultproject.io/docs/internals/plugins) to support new crypto algorithms or signing procedures which are not immediately supported by HSMs.

A installation guide can be found [here](https://github.com/WorldHealthOrganization/ddcc-trusted-party-reference-implementation/blob/master/docs/HASHICORPVAULT.md).

### Matchbox Server

### HApi FHIR

### OpenHIM

### DDCC Transactions Mediator

### Postgres

### Mongo DB



## Out of Scope

The demo cluster contains currently no monitoring or auditing toolstack, because each platform provides normally it's own stack. 





