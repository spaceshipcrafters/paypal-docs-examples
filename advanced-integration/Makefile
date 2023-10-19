.PHONY: up code browse dev clean clean-up

.env:
	cp .env.example .env

up: .env
	docker compose up -d

ps: up
	scripts/ps.sh

logs: up
	docker compose logs --tail=8 -f $(svc)

restart:
	docker compose restart $(svc)

code: up
	scripts/code.sh "./server ./client"

browse: up
	scripts/browse.sh

dev: up ps code browse

#
# Cleanup

clean-up:
	docker compose down -t 0 --remove-orphans

clean: clean-up
