# Installation
First add the hashicorp helm charts to helm repo of you K8s cluster with
```bash
helm repo add hashicorp https://helm.releases.hashicorp.com
```
this will add the helm charts of all hashicorps' open source components.

Then install the vault to your cluster
```bash
helm install vault hashicorp/vault
```
The default installation option will install a production ready system.
For development istallations refer to the documnentation unter links.
After installation you can see three pods of the vault running.
```bash
kubectl get pods -l app.kubernetes.io/name=vault

NAME               READY   STATUS    RESTARTS   AGE
vault-0            0/1     Running   0          1m49s
vault-1            0/1     Running   0          1m49s
vault-2            0/1     Running   0          1m49s
```
The vault must be unsealed to ensure the immutability of its cryptografic system.  
So first issue an command to the first vault:

```bash
kubectl exec -ti vault-0 -- vault operator init
```
This produces the following output:
```bash
Unseal Key 1: MBFSDepD9E6whREc6Dj+k3pMaKJ6cCnCUWcySJQymObb
Unseal Key 2: zQj4v22k9ixegS+94HJwmIaWLBL3nZHe1i+b/wHz25fr
Unseal Key 3: 7dbPPeeGGW3SmeBFFo04peCKkXFuuyKc8b2DuntA4VU5
Unseal Key 4: tLt+ME7Z7hYUATfWnuQdfCEgnKA2L173dptAwfmenCdf
Unseal Key 5: vYt9bxLr0+OzJ8m7c7cNMFj7nvdLljj0xWRbpLezFAI9

Initial Root Token: s.zJNwZlRrqISjyBHFMiEca6GF
```
Be sure to note that unseal keys an the root key and store it in a secret place.  
The initiation process can be done only once and 3 of these unseal keys must be provided on every restart of the vault system.  
issuing 
```bash
kubectl exec -ti vault-0 -- vault operator unseal MBFSDepD9E6whREc6Dj+k3pMaKJ6cCnCUWcySJQymObb
kubectl exec -ti vault-0 -- vault operator unseal zQj4v22k9ixegS+94HJwmIaWLBL3nZHe1i+b/wHz25fr
kubectl exec -ti vault-0 -- vault operator unseal vYt9bxLr0+OzJ8m7c7cNMFj7nvdLljj0xWRbpLezFAI9
```
unseals the vault (3 of the 5 keys from above must be provided), the follwing output shows the unsealing was successful:
```bash
Key                Value
---                -----
Seal Type          shamir
Initialized        true
Sealed             true
Total Shares       5
Threshold          3
Unseal Progress    1/3
Unseal Nonce       8840133d-6f38-20f3-f2b0-64b853f2617c
Version            1.9.0
Storage Type       file
HA Enabled         false
..
Key                Value
---                -----
Seal Type          shamir
Initialized        true
Sealed             true
Total Shares       5
Threshold          3
Unseal Progress    2/3
Unseal Nonce       2840133d-6f618-20f3-f2b0-64b853e2617c
Version            1.9.0
Storage Type       file
HA Enabled         false

..
Key             Value
---             -----
Seal Type       shamir
Initialized     true
Sealed          false
Total Shares    5
Threshold       3
Version         1.9.0
Storage Type    file
Cluster Name    vault-cluster-dfcfd22a
Cluster ID      e3ba927c-1dab-5b8c-b042-9aa119e7b41b
HA Enabled      false
```

In the end the **seal** state changes to false to indicate successful initation.

Hashicorp vault comes with an ui to ease configuration tasks. UI is enabled by default, but can be disabled to harden the installation.
The UI as well as the API can be accessed via port 8200 if default installation was used and port was not changed during helm installation.
The vault can be tight to an ingress for the web ui to become exposed.  


#### Links:
[vault installation](https://www.vaultproject.io/docs/platform/k8s/helm/run)
# Administration
## Secrets
Secrets are stored in vault as key/value (k/v) stores.
## Vault agent injection
A special feature is the vault agent injection. 
The vault acts as a sidecar to the application container, providing it with initialzation values. Therefore it is also called init container.  
After injecting the initialization values the init container finishes, i. e. it is in state stopped, which is normal and indicates a successful run.
The injection can be achieved by annotations to the deployment of the application container. This may look like: 
```yaml
annotations:
  vault.hashicorp.com/agent-init-first: "true" # init container has to finish before application container runs
  vault.hashicorp.com/agent-inject: "true" # activates the injection, false=deactivates it
  vault.hashicorp.com/agent-pre-populate-only: "true"
  vault.hashicorp.com/role: fhir-postgres-db # the role in vault that is configured for the secrets that should be accessed
  vault.hashicorp.com/agent-inject-secret-postgres: postgres-db/data/database #path of the secret in vault
  vault.hashicorp.com/agent-inject-template-postgres: |
        {{- with secret "postgres-db/data/database" -}}
            export POSTGRES_DB={{ .Data.data.POSTGRES_DB }}
            export POSTGRES_USER={{ .Data.data.POSTGRES_USER }}
            export POSTGRES_PASSWORD={{ .Data.data.POSTGRES_PASSWORD }}
        {{- end -}}

 # template for the injection - the k/v pairs under the path are mapped to a volume mount /vault/secret/postgres in above case (form vault.hashicorp.com/agent-inject-secret-<mountpoint>)
```

# Remarks  
By default after installation the certificate validity is reduced to 30 days, which is not useful in productive environments.
To set a reasonable validity time set it via the following command.
```bash
 kubectl exec -ti vault-0 --  vault secrets tune -max-lease-ttl=8760h pki
```
which will the maximum certificate validity to one year.

# Considerations