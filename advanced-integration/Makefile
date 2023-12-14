.PHONY: up code browse dev clean clean-up

.env:
	cp .env.example .env

up: .env
	docker compose up -d

#
# Cleanup

clean-up:
	docker compose down -t 0 --remove-orphans

clean: clean-up
