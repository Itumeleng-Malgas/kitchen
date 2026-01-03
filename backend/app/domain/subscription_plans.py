from enum import Enum

class Plan(str, Enum):
    FREE = "FREE"
    BASIC = "BASIC"
    PRO = "PRO"

PLAN_LIMITS = {
    Plan.FREE: {
        "max_active_orders": 10,
        "realtime": False,
    },
    Plan.BASIC: {
        "max_active_orders": 100,
        "realtime": True,
    },
    Plan.PRO: {
        "max_active_orders": None,
        "realtime": True,
    },
}
