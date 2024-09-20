import multiprocessing

wsgi_app = "conf.wsgi"
limit_request_line = 0
chdir = "/django/"
bind = "0.0.0.0:8000"
workers = multiprocessing.cpu_count() * 2 + 1
max_requests = 1000
max_requests_jitter = 10
timeout = 900
