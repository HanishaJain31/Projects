package gls.com;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class EditScreen
 */
@WebServlet("/EditScreen")
public class EditScreen extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public EditScreen() {
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
		try
		{
			Class.forName("com.mysql.cj.jdbc.Driver");
			Connection con=DriverManager.getConnection("jdbc:mysql://localhost:3306/mysql","root","hanisha@3103");
			String editSQL="select id,bname,bauthor,bprice from book where id=?";
			PreparedStatement pst=con.prepareStatement(editSQL);
			pst.setInt(1, id);
			ResultSet rs=pst.executeQuery();
			rs.next();
			out.println("<form action='EditUrl?id="+id+"' method='post'>");
			out.println("<table align='center'>");
			out.println("<tr>");
			out.println("<td>Book Name : </td>");
			out.println("<td><input type='text' name='bname' value='"+rs.getString(2)+"'></td>");
			out.println("</tr>");
			out.println("<tr>");
			out.println("<td>Book Author : </td>");
			out.println("<td><input type='text' name='bauthor' value='"+rs.getString(3)+"'></td>");
			out.println("</tr>");
			out.println("<tr>");
			out.println("<td>Book Price : </td>");
			out.println("<td><input type='text' name='bprice' value='"+rs.getString(4)+"'></td>");
			out.println("</tr>");
			out.println("<tr>");
			out.println("<td><input type='submit' value='Edit'></td>");
			out.println("<td><input type='reset' value='Cancel'></td>");
			out.println("</tr>");
			out.println("</table>");
			out.println("</form>");
			
		}
		catch(Exception e)
		{
			System.out.println(e);
		}
		out.println("<a href='home.html'>Home</a>");
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}

}
