from flask import render_template, request, redirect, session

def register_routes(app):
    
    @app.route("/")
    def home():
        return redirect("/login")
    
    @app.route("/login", methods=["GET", "POST"])
    def login():
        if request.method == "POST":
            user_id = int(request.form["user_id"])
            user = app.user_service.get_user(user_id)
            
            if user:
                session["user_id"] = user.user_id
                session["role"] = user.role
                return redirect("/dashboard")
            
        return render_template("login.html")
    
    @app.route("/dashboard")
    def dashboard():
        if "user_id" not in session:
            return redirect("/login")
        
        return render_template("dashboard.html", role=session["role"])
    
    @app.route("/properties")
    def properties():
        props = app.property_service.get_all_properties()
        return render_template("properties.html", properties=props)
    
    @app.route("/bookings")
    def bookings():
        books = app.booking_service.get_all_bookings()
        return render_template("bookings.html", bookings=books)