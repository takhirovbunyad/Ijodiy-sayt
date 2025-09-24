class MultiDbRouter:
    # app → db mapping
    app_db_map = {
        "dash": "db1",
        "sher": "db1",
        "philosophy": "db1",

        "books": "db2",
        "search": "db2",
        "repairing": "db2",

    }

    def db_for_read(self, model, **hints):
        app_label = model._meta.app_label
        return self.app_db_map.get(app_label, "db2")  # default read db2

    def db_for_write(self, model, **hints):
        # yozish faqat master (db3)
        return "default"

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        # faqat yozish master db3 ga bo‘lishi kerak
        return db == "default"
