COMPOSE := docker compose

.PHONY: init up down restart logs shell artisan composer npm migrate seed test lint build

init:
	@test -f .env || cp .env.example .env
	@printf 'Set LOCAL_UID=%s and LOCAL_GID=%s in .env, then run make build.\n' "$$(id -u)" "$$(id -g)"

up:
	$(COMPOSE) up -d $(ARGS)
down:
	$(COMPOSE) down $(ARGS)
restart:
	$(COMPOSE) restart $(ARGS)
logs:
	$(COMPOSE) logs -f $(ARGS)
shell:
	$(COMPOSE) exec app sh
artisan:
	$(COMPOSE) exec app php artisan $(ARGS)
composer:
	$(COMPOSE) exec app composer $(ARGS)
npm:
	$(COMPOSE) exec frontend npm $(ARGS)
migrate:
	$(COMPOSE) exec app php artisan migrate $(ARGS)
seed:
	$(COMPOSE) exec app php artisan db:seed $(ARGS)
test:
	$(COMPOSE) exec app php artisan test $(ARGS)
lint:
	$(COMPOSE) exec app ./vendor/bin/pint $(ARGS)
build:
	$(COMPOSE) build $(ARGS)
