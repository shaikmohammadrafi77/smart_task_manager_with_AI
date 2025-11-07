"""APScheduler configuration"""

from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.jobstores.memory import MemoryJobStore

scheduler = BackgroundScheduler(
    jobstores={"default": MemoryJobStore()},
    timezone="UTC",
)

