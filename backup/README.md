# MongoDB Backup and Restore for Docker

This directory contains scripts for backing up and restoring the MongoDB database running in Docker containers.

## Setup

1. Make the scripts executable:
```bash
chmod +x docker-backup.sh docker-restore.sh
```

## Usage

### Creating a Backup

Run the backup script:
```bash
./docker-backup.sh
```

The script will:
- Connect to the MongoDB container
- Create a backup with timestamp in the `/var/opt/sms-jkkniu-backups/data/` folder
- Keep the latest 5 backups (removing older ones)

### Restoring from a Backup

Run the restore script:
```bash
./docker-restore.sh
```

The script will:
- Show a list of available backups
- Ask which backup to restore
- Confirm before proceeding with the restore

## Scheduling Backups

To schedule daily backups at 2:00 AM, add a cron job:

```bash
crontab -e
```

Then add this line:

```
0 2 * * * /var/www/sms-jkkniu/backup/docker-backup.sh >> /var/opt/sms-jkkniu-backups/backup.log 2>&1
```

## Backup Location

All backups are stored in:
```
/var/opt/sms-jkkniu-backups/data/
```

For disaster recovery, consider copying these backups to an external location regularly.
