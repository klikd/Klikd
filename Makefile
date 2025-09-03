.PHONY: help dev build test lint typecheck clean setup migrate seed deploy openapi

help: ## Show this help message
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

dev: ## Start development environment
	docker-compose up -d
	pnpm run dev

build: ## Build all packages and apps
	pnpm run build

test: ## Run all tests
	pnpm run test

test-e2e: ## Run end-to-end tests
	pnpm run test:e2e

lint: ## Lint all code
	pnpm run lint

typecheck: ## Run TypeScript type checking
	pnpm run typecheck

clean: ## Clean all build artifacts and dependencies
	pnpm run clean
	docker-compose down -v

setup: ## Set up local development environment
	pnpm run setup

migrate: ## Run database migrations
	pnpm run migrate

seed: ## Seed database with sample data
	pnpm run seed

deploy: ## Deploy to staging/production
	pnpm run deploy

openapi: ## Generate OpenAPI documentation
	pnpm run generate:openapi

check-env: ## Validate environment variables
	pnpm run check:env

check-contracts: ## Validate API contracts
	pnpm run check:contracts

infra-up: ## Start local infrastructure only
	docker-compose up -d

infra-down: ## Stop local infrastructure
	docker-compose down

infra-logs: ## View infrastructure logs
	docker-compose logs -f
