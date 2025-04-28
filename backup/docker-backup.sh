#!/bin/bash

# Set variables
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="/var/www/sms-jkkniu/backup/data"
DB_NAME="sms"
BACKUP_FILE="mongodb_backup_${DB_NAME}_${TIMESTAMP}.gz"

# Create backup directory if it doesn't exist
mkdir -p ${BACKUP_DIR}

# Get MongoDB container ID
echo "Finding MongoDB container..."
CONTAINER_ID=$(docker ps -qf "name=sm-system-mongo-1")

if [ -z "$CONTAINER_ID" ]; then
    echo "MongoDB container not found! Trying alternative name..."
    CONTAINER_ID=$(docker ps -qf "name=mongo")
    
    if [ -z "$CONTAINER_ID" ]; then
        echo "MongoDB container not found!"
        exit 1
    fi
fi

echo "MongoDB container found: $CONTAINER_ID"
echo "Starting backup..."

# Run mongodump inside the container and save the output to the host
docker exec -i ${CONTAINER_ID} sh -c "mongodump --host localhost --db ${DB_NAME} --archive --gzip" > "${BACKUP_DIR}/${BACKUP_FILE}"

# Check if backup was successful
if [ $? -eq 0 ]; then
    echo "Backup completed successfully: ${BACKUP_DIR}/${BACKUP_FILE}"
    echo "Backup size: $(du -h ${BACKUP_DIR}/${BACKUP_FILE} | cut -f1)"
else
    echo "Backup failed!"
    exit 1
fi

# Optional: Keep only the latest 5 backups to save space
echo "Cleaning old backups, keeping latest 5..."
ls -tp ${BACKUP_DIR}/mongodb_backup_*.gz | grep -v '/$' | tail -n +6 | xargs -I {} rm -- {} 2>/dev/null || true

echo "Backup process completed."
