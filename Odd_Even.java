import java.util.*;

public class Odd_Even {
   public static void main(String[] args)
   {
       System.out.println("Enter a number");
       Scanner sc = new Scanner(System.in);
       int n=sc.nextInt();
       if(n%2==0)
       System.out.println("Even");
       else
       System.out.println("Odd");
   }   
}
