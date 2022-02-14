# Introduction
The certmanager is a module provided by the Lets Encrypt initiative. They issue TLS certificates to internet domains with the aim that no website shall drive unencrypted traffic. The certificates are provided free of charge and are internationally accepted, which means, that their certificate authority is part of the keystores of openJDK, most of the OS keychains and webbrowsers.
# Installation
The certmanager will be installed via helm with
```bash
helm repo add jetstack https://charts.jetstack.io
```
then
```bash
helm install cert-manager jetstack/cert-manager --version v1.7.0 --namespace default --set installCRDs=true --set nodeSelector."kubernetes\.io/os"=linux
```
the following output indicates, the installation was successful
```bash 
NAME: cert-manager
LAST DEPLOYED: Mon Jan 31 17:53:31 2022
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES:
cert-manager v1.7.0 has been deployed successfully!
```
A cluster issuer has to be deployed with the following yaml manifest which should be copied to a file cluserIssuer.yaml
```yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: MY_EMAIL_ADDRESS
    privateKeySecretRef:
      name: letsencrypt
    solvers:
    - http01:
        ingress:
          class: nginx
          podTemplate:
            spec:
              nodeSelector:
                "kubernetes.io/os": linux
```
Please note, that a valid email address must be provided in the cluster issuer.
The issuer is installed via
```bash
kubectl apply -f clusterIssuer.yaml
```
The certs are generated with the annotation  _cert-manager.io/cluster-issuer: letsencrypt_ in the ingress controller that routes the hosts.
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: hello-world-ingress
  annotations:
    kubernetes.io/ingress.class: nginx
    nginx.ingress.kubernetes.io/rewrite-target: /$1
    nginx.ingress.kubernetes.io/use-regex: "true"
    cert-manager.io/cluster-issuer: letsencrypt
spec:
  tls:
  - hosts:
    - hello-world-ingress.MY_CUSTOM_DOMAIN
    secretName: tls-secret
  rules:
  - host: hello-world-ingress.MY_CUSTOM_DOMAIN
    http:
      paths:
      - path: /hello-world-one(/|$)(.*)
        pathType: Prefix
        backend:
          service:
            name: aks-helloworld-one
            port:
              number: 80
```
This will store a TLS certificate in a secret named _tls-secret_ for the host _hello-world-ingress.MY_CUSTOM_DOMAIN_
# Remarks
As part of the certification process the Lets Encrypt servers will try to reach a .well-known-url on our domain to verify that it really exists. So we must ensure that the host has a valid domain name and is reachable via internet. 
# Considerations
