#/bin/bash
bundle exec jekyll serve --detach --host 10.0.8.4 --port 80
bundle exec jekyll serve --detach --host 10.0.8.4 --port 443 --ssl-key private.key --ssl-cert cert.pem
