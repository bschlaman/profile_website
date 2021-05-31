#!/bin/bash
set -eEuo pipefail

ROOT="$(cd "$(dirname "$0")/.." &>/dev/null; pwd -P)"
echo ROOT: $ROOT
alias docker="sudo docker"

function build_node(){
	read -p "Enter domain name: " domain
	[ $(wc -w <<< "$domain") -ne 1 ] && echo "Error: Need a domain" && exit 1
	docker build -t node-app \
		--build-arg "domain=$domain" \
		-f $ROOT/docker/node.dockerfile $ROOT
}
function build_mongodb(){
	docker build -t mongodb-app -f $ROOT/docker/mongodb.dockerfile $ROOT
}
function run_node(){
	docker run --rm -dit \
			-v $ROOT/src:/usr/src/app \
			-v $ROOT/assets:/usr/src/assets \
	    -p 80:3001 \
	    -p 443:3002 \
	    --net net1 \
	    --name node_running node-app
}
function run_mongodb(){
	docker run --rm -d \
	    --net net1 \
	    --name mongodb_running mongodb-app
}
function connect_mongodb(){
	# create another instance to use the cli
	docker run --rm -it \
	    --net net1 mongodb-app \
	    mongo --host mongodb_running test
}
function select_star_users(){
	docker run --rm -it \
	    --net net1 mysql \
	    mysql -hmysql_running -uuser -p \
			-e "select * from USERDATA.users;"
}
function restart_node(){
	# docker restart apache_running
	docker cp $ROOT/src/server.js node_running:/usr/src/app
}
function create_network(){
	docker network create net1
}
function provision_certs(){
	docker run -it --rm --name certbot \
		-p 80:80 \
		-v $ROOT/letsencrypt:/etc/letsencrypt \
		-v $ROOT/letsencrypt/lib:/var/lib/letsencrypt \
		certbot/certbot certonly --register-unsafely-without-email
}

function main(){
	PS3="What would you like to do?"$'\n'" -> "
	COLUMNS=12
	select action in \
		build_node \
		build_mongodb \
		run_node \
		run_mongodb \
		connect_mongodb \
		select_star_users \
		restart_node \
		create_network \
		provision_certs \
		"build all" \
		"run all" \
		"stop all"
	do
	case $action in
		build_node )
			build_node
			break;;
		build_mongodb )
			build_mongodb
			break;;
		run_node )
			run_node
			break;;
		run_mongodb )
			run_mongodb
			break;;
		connect_mongodb )
			connect_mongodb
			break;;
		select_star_users )
			select_star_users
			break;;
		restart_node )
			restart_node
			break;;
		create_network )
			create_network
			break;;
		provision_certs )
			provision_certs
			break;;
		"build all" )
			build_node
			build_mongodb
			break;;
		"run all" )
			run_node
			run_mongodb
			break;;
		"stop all" )
			docker stop $(docker ps -a -q)
			break;;
	esac
	done
}
main



