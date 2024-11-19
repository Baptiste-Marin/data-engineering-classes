#!/bin/bash

echo "Attente que kafka soit prêt..."
sleep 10

TOPICS=("pacemaker-data")

for TOPIC in "${TOPICS[@]}"; do
	echo "Création du topic $TOPIC..."
	kafka-topics --create --bootstrap-server kafka:9092 --replication-factor 1 --partitions 1 --topic "$TOPIC" || {
		echo "Le topic $TOPIC existe déjà ou une erreur est survenue."
	}
done

echo "Initialisation des topics terminée."
