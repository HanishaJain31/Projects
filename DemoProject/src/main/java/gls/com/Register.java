package gls.com;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class Register
 */
@WebServlet("/Register")
public class Register extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public Register() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		response.getWriter().append("Served at: ").append(request.getContextPath());
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		//doGet(request, response);
		response.setContentType("text/html");
		PrintWriter out=response.getWriter();
		String bname=request.getParameter("bname");
		String bauthor=request.getParameter("bauthor");
		String bprice=request.getParameter("bprice");
		try
		{
			Class.forName("com.mysql.cj.jdbc.Driver");
			Connection con=DriverManager.getConnection("jdbc:mysql://localhost:3306/mysql","root","hanisha@3103");
			String insertSQL="insert into book (bname,bauthor,bprice) values (?,?,?)";
			PreparedStatement pst=con.prepareStatement(insertSQL);
			pst.setString(1, bname);
			pst.setString(2, bauthor);
			pst.setString(3, bprice);
			pst.executeUpdate();
			out.println("Book added to the database.");
			out.println("<br>");
		}
		catch(Exception e)
		{
			System.out.println(e);
		}
		out.println("<a href='home.html'>Home</a>");
		out.println("<br>");
		out.println("<a href='BookList'>Book List</a>");
	}

}
