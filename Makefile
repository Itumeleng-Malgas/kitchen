.PHONY: dev prod build down logs migrate shell

dev:
	docker compose up --build

prod:
	docker compose --profile prod up --build -d

build:
	docker compose build

down:
	docker compose down -v

logs:
	docker compose logs -f

migrate:
	docker compose run --rm migrate

shell:
	docker compose exec backend sh
