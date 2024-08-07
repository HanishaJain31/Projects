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
 * Servlet implementation class EditUrl
 */
@WebServlet("/EditUrl")
public class EditUrl extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public EditUrl() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		//response.getWriter().append("Served at: ").append(request.getContextPath());
		response.setContentType("text/html");
		PrintWriter out=response.getWriter();
		int id=Integer.parseInt(request.getParameter("id"));
		String bname=request.getParameter("bname");
		String bauthor=request.getParameter("bauthor");
		String bprice=request.getParameter("bprice");
		try
		{
			Class.forName("com.mysql.cj.jdbc.Driver");
			Connection con=DriverManager.getConnection("jdbc:mysql://localhost:3306/mysql","root","hanisha@3103");
			String editSQL="update book set bname=?,bauthor=?,bprice=? where id=?";
			PreparedStatement pst=con.prepareStatement(editSQL);
			pst.setString(1, bname);
			pst.setString(2, bauthor);
			pst.setString(3, bprice);
			pst.setInt(4, id);
			pst.executeUpdate();
			out.println("Record is edited successfully.");
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

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}

}
