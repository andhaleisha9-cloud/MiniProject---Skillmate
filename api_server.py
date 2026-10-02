import http.server
import socketserver
import sqlite3
import json
import os
import urllib.parse

PORT = 5001
DB_FILE = os.path.join(os.path.dirname(__file__), "skills_partner.db")

def get_db():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

class SQLiteAPIHandler(http.server.BaseHTTPRequestHandler):
    def _send_json(self, data, status=200):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        self.wfile.write(json.dumps(data, indent=2).encode('utf-8'))

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path.rstrip('/')

        conn = get_db()
        cursor = conn.cursor()

        try:
            if path == '/api/students':
                cursor.execute("SELECT * FROM students")
                students = [dict(row) for row in cursor.fetchall()]
                for s in students:
                    # Fetch skills
                    cursor.execute("SELECT skill FROM student_skills WHERE student_id = ?", (s['id'],))
                    s['skills'] = [r['skill'] for r in cursor.fetchall()]
                    # Fetch interests
                    cursor.execute("SELECT interest FROM student_interests WHERE student_id = ?", (s['id'],))
                    s['interests'] = [r['interest'] for r in cursor.fetchall()]
                    # Fetch preferred project types
                    cursor.execute("SELECT project_type FROM student_preferred_project_types WHERE student_id = ?", (s['id'],))
                    s['preferredProjectTypes'] = [r['project_type'] for r in cursor.fetchall()]
                    # Fetch past projects
                    cursor.execute("SELECT * FROM past_projects WHERE student_id = ?", (s['id'],))
                    projects = []
                    for pr in cursor.fetchall():
                        p_dict = dict(pr)
                        p_dict['techStack'] = json.loads(p_dict['tech_stack'])
                        del p_dict['tech_stack']
                        projects.append(p_dict)
                    s['projects'] = projects
                    s['contact'] = {
                        "email": s['email'],
                        "phone": s['phone'],
                        "github": s['github'],
                        "linkedin": s['linkedin'],
                        "discord": s['discord']
                    }
                    s['lookingForPartner'] = bool(s['looking_for_partner'])

                self._send_json({"count": len(students), "students": students})

            elif path == '/api/posts':
                cursor.execute("SELECT * FROM project_posts")
                posts = []
                for row in cursor.fetchall():
                    p = dict(row)
                    p['rolesNeeded'] = json.loads(p['roles_needed'])
                    p['skillsRequired'] = json.loads(p['skills_required'])
                    p['interestedStudentIds'] = json.loads(p['interested_student_ids'])
                    del p['roles_needed']
                    del p['skills_required']
                    del p['interested_student_ids']
                    posts.append(p)
                self._send_json({"count": len(posts), "posts": posts})

            elif path == '/api/requests':
                cursor.execute("SELECT * FROM project_requests")
                requests = [dict(row) for row in cursor.fetchall()]
                self._send_json({"count": len(requests), "requests": requests})

            elif path == '/api/partners':
                cursor.execute("SELECT * FROM project_partners")
                partners = [dict(row) for row in cursor.fetchall()]
                self._send_json({"count": len(partners), "partners": partners})

            elif path == '/api/schema':
                cursor.execute("SELECT name, sql FROM sqlite_master WHERE type='table'")
                tables = [dict(row) for row in cursor.fetchall()]
                self._send_json({"tables": tables})

            else:
                self._send_json({
                    "message": "SkillMate SQLite API Server",
                    "endpoints": [
                        "/api/students",
                        "/api/posts",
                        "/api/requests",
                        "/api/partners",
                        "/api/schema"
                    ]
                })
        finally:
            conn.close()

if __name__ == "__main__":
    with socketserver.TCPServer(("", PORT), SQLiteAPIHandler) as httpd:
        print(f"SQLite API server running at http://localhost:{PORT}")
        httpd.serve_forever()
