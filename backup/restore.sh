#!/bin/bash

# Set variables
BACKUP_DIR="/home/nobin/ProjectWork/Working_Project/sms-jkkniu/backup/data"
MONGO_URI="mongodb://ainobin9:7HbThBKCIe02835o@cluster0-shard-00-00.vffhq.mongodb.net:27017,cluster0-shard-00-01.vffhq.mongodb.net:27017,cluster0-shard-00-02.vffhq.mongodb.net:27017/?ssl=true&replicaSet=atlas-l4c31q-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0"
DB_NAME="sms-jkkniu"

# List available backups
echo "Available backups:"
ls -1t ${BACKUP_DIR}/mongodb_backup_*.gz | nl

# Ask user which backup to restore
echo "Enter the number of the backup you want to restore:"
read BACKUP_NUMBER

# Get the selected backup file
BACKUP_FILE=$(ls -1t ${BACKUP_DIR}/mongodb_backup_*.gz | sed -n "${BACKUP_NUMBER}p")

if [ ! -f "$BACKUP_FILE" ]; then
    echo "Invalid selection or backup file not found!"
    exit 1
fi

echo "You selected: $BACKUP_FILE"
echo "WARNING: This will replace the current database!"
echo "Are you sure you want to continue? (y/N)"
read CONFIRM

if [[ ! "$CONFIRM" =~ ^[Yy]$ ]]; then
    echo "Restore canceled."
    exit 0
fi

# Restore from backup
echo "Starting restore process..."
mongorestore --uri="${MONGO_URI}" --nsFrom="${DB_NAME}.*" --nsTo="${DB_NAME}.*" --gzip --archive=${BACKUP_FILE}

# Check if restore was successful
if [ $? -eq 0 ]; then
    echo "Restore completed successfully from: ${BACKUP_FILE}"
else
    echo "Restore failed!"
    exit 1
fi

echo "Restore process completed."
