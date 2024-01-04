# address_inv_web_frontend

## Installation

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression
```

Install nodejs lts using scoop

```powershell
scoop install nodejs-lts
```

Run npm install

```powershell
npm install
```

## Development

```powershell
npm run dev
```

## Build

```powershell
npm run build
```

## Building for linux

Install [wsl](https://docs.microsoft.com/en-us/windows/wsl/install-win10)

```powershell
wsl --install
```

Open ubuntu and install nodejs from [nodesource](https://github.com/nodesource/distributions)

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - &&\
sudo apt-get install -y nodejs
```
