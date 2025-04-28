#!/bin/bash

# Set variables
BACKUP_DIR="/home/nobin/ProjectWork/Working_Project/sms-jkkniu/backup/data"
DB_NAME="sms"

# Check if backup directory exists
if [ ! -d "$BACKUP_DIR" ]; then
    echo "Backup directory doesn't exist: $BACKUP_DIR"
    exit 1
fi

# List available backups
echo "Available backups:"
ls -1t ${BACKUP_DIR}/mongodb_backup_*.gz 2>/dev/null | nl

if [ $? -ne 0 ] || [ $(ls -1 ${BACKUP_DIR}/mongodb_backup_*.gz 2>/dev/null | wc -l) -eq 0 ]; then
    echo "No backups found in ${BACKUP_DIR}"
    exit 1
fi

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
echo "WARNING: This will replace the current database!"
echo "Are you sure you want to continue? (y/N)"
read CONFIRM

if [[ ! "$CONFIRM" =~ ^[Yy]$ ]]; then
    echo "Restore canceled."
    exit 0
fi

# Restore from backup
echo "Starting restore process..."
cat ${BACKUP_FILE} | docker exec -i ${CONTAINER_ID} mongorestore --host localhost --nsFrom="${DB_NAME}.*" --nsTo="${DB_NAME}.*" --gzip --archive

# Check if restore was successful
if [ $? -eq 0 ]; then
    echo "Restore completed successfully from: ${BACKUP_FILE}"
else
    echo "Restore failed!"
    exit 1
fi

echo "Restore process completed."
