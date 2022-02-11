# Security Guide

## Certificate Governance

### CSCA/DSC
For generating CSCA/DSC or wrapper certificates, the [certificate governance of the EU DCC](https://github.com/eu-digital-green-certificates/dgc-overview/blob/main/guides/certificate-governance.md) should be considered,
because it defines already the most important PKI parameters/rules which are accepted and supported by the most CAs. Public, Private and Self Signed CAs are supported, because all of the certificates have an kind of "private" use, and must not be resolved by any browser.

An example how to generate certificates can be found [here](https://github.com/eu-digital-green-certificates/dgc-participating-countries/blob/main/gateway/CertificatePreperation.md).

<b>Note</b>: ICAO defines in the [9303 Part 12](https://www.icao.int/publications/Documents/9303_p12_cons_en.pdf) Document, Chapter 4.1.6.3, that the usage of Eliptic Curves requires explicit curve parameters instead of using curve names/implicit parameters.
This deriviation can lead in some implementations to exceptions,when certificates are generated according to this specification, 
because the CurveNames (e.g. prime256v1) are much more common within the most frameworks.

### Web Certificates

All certificates which are used in public areas for TLS traffic should be issued by any public CA listed in the [CAB Browser Forum](https://cabforum.org) 

For the most purposes is [Let's Encrypt](https://letsencrypt.org) a good choice, but it must be considered that this provides only <b>Domain validated</b> certificates. If <b>Organization validated</b> certificates are required, another CA should be choosen.
Private CAs should only be used, if the network is completly private.


### Certificate/Key Management

Ideally all private Keys should be managed by an HSM without any possibility of exporting the keys. If this is not possible, it should be considered to hold the private keys into a software vault e.g. Hashi Corp Vault or encrypted solutions like Java Key Stores with limited access to a small amount of people.
In some use cases, a air gapped solution fit's better, when an appropiate security is guaranteed for the air gapped device. 


### Authentication Certificates

All certificates with the purpose of client authentication should be generated within a private CA to have the maximum level of security. Those certificates should be created with the extend key usage "Client Authentication". Ideally the certificates are hold on smartcards or similiar deviced, secured by a pin/biometries, issued per employee.
The security requirements must be the same as described in the certificate governance. When the certificate are generated, one detail must be considered: 

```
Whatever method you use to generate the certificate and key files, the Common Name value used for 
the server and client certificates/keys must each differ from the Common Name value used for the 
CA certificate. Otherwise, the certificate and key files will not work for servers compiled using OpenSSL.
```

If this is not respected, the verification of the certificate chain fails.

## TLS Encryption

TLS 1.3 Encryption should be used in all public traffic according to the recommended [TLS Parameter](https://www.iana.org/assignments/tls-parameters/tls-parameters.xhtml#tls-parameters-4)

Depending on the environment, the internal cluster must be procted by TLS as well. For instance in scenarios where the infrastructure is hosted accross distributed environments and availability zones. 
It's recommend in cloud environments to use protected service meshes e.g. Istio, Spiffe/Spire etc.

## Cluster Security

When exposing routes to the public, each ingress must be configured for TLS usage and (if possible) for client certificate authentication, for instance by activating [Annotations](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/annotations/#client-certificate-authentication)
If this option is activated, it may be necessary to connect to this endpoints via an Proxy which is configured fot a pass through client authentication.

<b>Note</b> If supported, the client authentication can be replaced by other authentication methods e.g. OAuth2 or SSI. 


