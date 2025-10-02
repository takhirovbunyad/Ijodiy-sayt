# my_app/routers.py

class MultiDbRouter:
    """
    Multi-DB Router:
      - Dash, Sher, Philosophy -> db1 (default)
      - Book, Search, Repairing -> db2
      - Boshqa hamma narsa -> db3
    """

    DB1_MODELS = ["dash", "sher", "philosophy"]
    DB2_MODELS = ["book", "search", "repairing"]

    def db_for_read(self, model, **hints):
        if model._meta.model_name in self.DB1_MODELS:
            return "default"
        if model._meta.model_name in self.DB2_MODELS:
            return "db2"
        return "db3"

    def db_for_write(self, model, **hints):
        if model._meta.model_name in self.DB1_MODELS:
            return "default"
        if model._meta.model_name in self.DB2_MODELS:
            return "db2"
        return "db3"

    def allow_relation(self, obj1, obj2, **hints):
        # Har xil DB o'rtasida ham relation'ga ruxsat beramiz
        return True

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        if model_name in self.DB1_MODELS:
            return db == "default"
        if model_name in self.DB2_MODELS:
            return db == "db2"
        return db == "db3"
