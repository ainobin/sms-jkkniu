#!/bin/bash

# Set variables
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="/home/nobin/ProjectWork/Working_Project/sms-jkkniu/backup/data"
MONGO_URI="mongodb://ainobin9:7HbThBKCIe02835o@cluster0-shard-00-00.vffhq.mongodb.net:27017,cluster0-shard-00-01.vffhq.mongodb.net:27017,cluster0-shard-00-02.vffhq.mongodb.net:27017/?ssl=true&replicaSet=atlas-l4c31q-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0"
DB_NAME="sms-jkkniu"
BACKUP_FILE="${BACKUP_DIR}/mongodb_backup_${DB_NAME}_${TIMESTAMP}.gz"

# Create backup directory if it doesn't exist
mkdir -p ${BACKUP_DIR}

# MongoDB dump command
echo "Starting MongoDB backup..."
mongodump --uri="${MONGO_URI}" --db=${DB_NAME} --archive=${BACKUP_FILE} --gzip

# Check if backup was successful
if [ $? -eq 0 ]; then
    echo "Backup completed successfully: ${BACKUP_FILE}"
    echo "Backup size: $(du -h ${BACKUP_FILE} | cut -f1)"
else
    echo "Backup failed!"
    exit 1
fi

# Optional: Keep only the latest 5 backups to save space
echo "Cleaning old backups, keeping latest 5..."
ls -tp ${BACKUP_DIR}/mongodb_backup_*.gz | grep -v '/$' | tail -n +6 | xargs -I {} rm -- {}

echo "Backup process completed."
