This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

server {
        listen 80;
        server_name aimakerlab.com www.aimakerlab.com;


        location / {


         proxy_pass http://127.0.0.1:3000;
         proxy_http_version 1.1;
         proxy_set_header Upgrade $http_upgrade;
         proxy_set_header Connection "upgrade";
         proxy_set_header Host $host;
         proxy_cache_bypass $http_upgrade;

        }
 }


sudo apt install nginx -y

sudo systemctl enable nginx
sudo systemctl start nginx
sudo systemctl reload nginx



sudo service restart nginx  


### 자동 실행
> sudo systemctl daemon-reload
> sudo systemctl enable myapp   # 부팅 시 자동 시작
> sudo systemctl start  myapp   # 즉시 실행

======================= /etc/systemd/system/myapp.service ==============

[Unit]
Description=My Node.js Dev Server
After=network.target

[Service]
User=ubuntu
WorkingDirectory=/home/ubuntu/front/front
# npm 대신 직접 node 명령어도 가능합니다. 예: ExecStart=/usr/bin/node index.js
ExecStart=/usr/bin/npm run dev
Restart=always
Environment=NODE_ENV=development
# 필요한 경우 PATH 지정
Environment=PATH=/usr/bin:/usr/local/bin
# 로그 남기려면
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=myapp

[Install]
WantedBy=multi-user.target
