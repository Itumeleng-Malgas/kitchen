from enum import Enum

class Role(str, Enum):
    OWNER = "owner"
    MANAGER = "manager"
    KITCHEN = "kitchen"
    RIDER = "rider"
