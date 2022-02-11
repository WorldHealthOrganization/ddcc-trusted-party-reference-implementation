# Trusted Party Reference Implementation

## Introduction

This project shall give an best practise overview how an trusted party backend could be implemented to adapt the DDCC in the own infrastructure. All content is only for testing and study purposes and should not be copied 1:1 to production before appropiate technical,security and data privacy audits according to the local regulations and legal aspects/ needs. 

## Overview

## Security Considerations

## Kubernetes


## Main Components

### Keycloak

The [keycloak](https://github.com/keycloak/keycloak) component is a widely used IAM system within open source solutions. It's in this solution used to provide user and client management functionalities. 

A installation guide can be found [here].(https://github.com/WorldHealthOrganization/ddcc-trusted-party-reference-implementation/blob/master/docs/KEYCLOAK.md)

### Hashicorp Vault

The [hashicorp vault](https://github.com/hashicorp/vault) component was introduced to fullfill the following tasks: 

- Provision of a secret store which can be operational decoupled from the plattform operator
- Provision of a [secure encryption/signing engine](https://learn.hashicorp.com/tutorials/vault/eaas-transit) which can be potentially enhanced by an [HSM](https://www.vaultproject.io/docs/enterprise/hsm)
- Provision of a basic [PKI](https://learn.hashicorp.com/tutorials/vault/pki-engine) for creating and storing certificates

In a future version, the vault can also be enhanced by [plugins](https://www.vaultproject.io/docs/internals/plugins) to support new crypto algorithms or signing procedures which are not immediately supported by HSMs.

A installation guide can be found [here].(https://github.com/WorldHealthOrganization/ddcc-trusted-party-reference-implementation/blob/master/docs/HASHICORPVAULT.md)

### Matchbox Server

### HApi FHIR

### OpenHIM

### DDCC Transactions Mediator

### Postgres

### Mongo DB






